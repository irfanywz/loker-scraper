from datetime import datetime
import os
import asyncio
from src.models.sources_model import SourcesModel
from src.models.jobs_model import JobsModel
from src.config.path import DATA_PATH
from src.core.browser_manager import BrowserManager

class SourceService:
    def __init__(self):
        self.model = SourcesModel()
        self.jobs_model = JobsModel()
        self.browser_manager = BrowserManager.get_instance()

    async def test_source(self, url, config, source_id=None):
        if not url or not config or not config.get('container'):
             return {"status": "error", "message": "URL dan Config Container wajib diisi"}

        page = None
        try:
            # Gunakan browser manager
            browser = await self.browser_manager.get_browser()
            page = await browser.newPage()
            
            # Timeout 30 detik
            await page.goto(url, {'waitUntil': 'networkidle2', 'timeout': 30000})
            
            # 1. Cari Container
            containers = await page.querySelectorAll(config.get('container'))
            count = len(containers)
            
            samples = []
            if count > 0:
                # Ambil sampel data (maksimal 3)
                for i in range(min(count, 3)):
                    item_data = {}
                    container = containers[i]
                    
                    # Extract Title
                    if config.get('title'):
                        t_el = await container.querySelector(config.get('title'))
                        if t_el:
                            item_data['title'] = await page.evaluate('(el) => el.textContent.trim()', t_el)
                    
                    # Extract Link
                    if config.get('link'):
                        l_el = await container.querySelector(config.get('link'))
                        if l_el:
                            item_data['link'] = await page.evaluate('(el) => el.href', l_el)
                            
                    # Extract Metadata
                    if config.get('metadata'):
                        item_data['metadata'] = {}
                        for meta in config.get('metadata'):
                            if meta.get('selector'):
                                m_el = await container.querySelector(meta.get('selector'))
                                if m_el:
                                    attr = meta.get('attribute')
                                    if attr:
                                        val = await page.evaluate('(el, attr) => el.getAttribute(attr)', m_el, attr)
                                        item_data['metadata'][meta.get('key')] = val.strip() if val else None
                                    else:
                                        item_data['metadata'][meta.get('key')] = await page.evaluate('(el) => el.textContent.trim()', m_el)
                    
                    samples.append(item_data)

            # 2. Cek Pagination
            pagination_found = False
            if config.get('pagination'):
                pag_el = await page.querySelector(config.get('pagination'))
                if pag_el:
                    pagination_found = True
            
            result_data = {}
            if count > 0:
                msg = f"Sukses! Ditemukan {count} item."
                if config.get('pagination'):
                    msg += f" Pagination: {'Found' if pagination_found else 'Not Found'}."
                
                result_data = {
                    "status": "success", 
                    "message": msg,
                    "data": {
                        "count": count,
                        "pagination": pagination_found,
                        "samples": samples
                    }
                }
            else:
                result_data = {"status": "error", "message": "Container tidak ditemukan."}
                
        except Exception as e:
            result_data = {"status": "error", "message": f"Error: {str(e)}"}
        finally:
            # Hanya tutup tab, browser tetap hidup
            if page:
                await page.close()

        if source_id:
            self.model.update(int(source_id), {
                "last_check_status": "success" if result_data["status"] == "success" else "failed",
                "last_check_message": result_data["message"],
                "last_check_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            
        return result_data

    async def test_all_sources(self):
        sources = self.model.get_all()
        results = []
        
        # Gunakan browser manager
        browser = await self.browser_manager.get_browser()
        
        # Kita bisa menggunakan satu page untuk loop test all, atau buka tutup per source
        # Untuk test all, lebih aman buka tutup per source agar state bersih
        for source in sources:
            page = None
            status = "failed"
            message = ""
            try:
                page = await browser.newPage()
                config = source.get('config', {})
                container_selector = config.get('container') or source.get('selector') # Fallback support
                
                await page.goto(source['url'], {'waitUntil': 'networkidle2', 'timeout': 15000})
                elements = await page.querySelectorAll(container_selector)
                if len(elements) > 0:
                    status = "success"
                    message = f"Found {len(elements)} elements"
                else:
                    status = "failed"
                    message = "No elements found"
            except Exception as e:
                status = "error"
                message = str(e)
            finally:
                if page:
                    await page.close()
            
            self.model.update(source['id'], {
                "last_check_status": "success" if status == "success" else "failed",
                "last_check_message": message,
                "last_check_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            
            results.append({"id": source['id'], "name": source['name'], "status": status, "message": message})
        
        return results

    async def scrape_all(self):
        sources = self.model.get_all()
        browser = await self.browser_manager.get_browser()
        
        # Load existing links for deduplication
        existing_links = self.jobs_model.get_existing_links()
        
        total_count = 0
        skipped_count = 0
        
        for source in sources:
            # Skip jika sumber dinonaktifkan
            if source.get('active') is False:
                continue

            page = None
            try:
                page = await browser.newPage()
                config = source.get('config', {})
                container_selector = config.get('container') or source.get('selector')
                if not container_selector: continue
                
                # Get max pages from config, default to 3 if not set
                try:
                    max_pages = int(config.get('max_pages', 3))
                except (ValueError, TypeError):
                    max_pages = 3
                
                await page.goto(source['url'], {'waitUntil': 'networkidle2', 'timeout': 60000})
                
                # Loop based on max_pages configuration
                for page_num in range(max_pages):
                    containers = await page.querySelectorAll(container_selector)
                    
                    for container in containers:
                        item_data = {
                            "source_id": source['id'],
                            "source_name": source['name'],
                            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        }
                        
                        # Extract Title & Link (Wajib)
                        if config.get('title'):
                            t_el = await container.querySelector(config.get('title'))
                            if t_el:
                                item_data['title'] = await page.evaluate('(el) => el.textContent.trim()', t_el)
                        
                        if config.get('link'):
                            l_el = await container.querySelector(config.get('link'))
                            if l_el:
                                item_data['link'] = await page.evaluate('(el) => el.href', l_el)
                        
                        # Extract Metadata (Opsional)
                        if config.get('metadata'):
                            item_data['metadata'] = {}
                            for meta in config.get('metadata'):
                                if meta.get('selector'):
                                    m_el = await container.querySelector(meta.get('selector'))
                                    if m_el:
                                        attr = meta.get('attribute')
                                        if attr:
                                            val = await page.evaluate('(el, attr) => el.getAttribute(attr)', m_el, attr)
                                            item_data['metadata'][meta.get('key')] = val.strip() if val else None
                                        else:
                                            item_data['metadata'][meta.get('key')] = await page.evaluate('(el) => el.textContent.trim()', m_el)
                        
                        # Simpan jika valid dan belum ada (Deduplikasi)
                        if item_data.get('title') and item_data.get('link'):
                            if item_data['link'] not in existing_links:
                                self.jobs_model.create(item_data)
                                existing_links.add(item_data['link']) # Add to set to prevent dupes within same run
                                total_count += 1
                            else:
                                skipped_count += 1
                    
                    # Handle Pagination
                    # Check if we reached max_pages - 1 to avoid unnecessary click on last page
                    if page_num < max_pages - 1:
                        pag_selector = config.get('pagination')
                        if pag_selector:
                            next_btn = await page.querySelector(pag_selector)
                            if next_btn:
                                try:
                                    await asyncio.gather(
                                        page.waitForNavigation({'waitUntil': 'networkidle2', 'timeout': 10000}),
                                        next_btn.click(),
                                    )
                                except Exception:
                                    # Jika timeout (misal SPA), tunggu manual sebentar
                                    await asyncio.sleep(2)
                            else:
                                break # Tombol next tidak ditemukan
                        else:
                            break # Tidak ada config pagination
                        
            except Exception as e:
                print(f"Error scraping {source.get('name')}: {e}")
            finally:
                if page:
                    await page.close()
        
        return {"status": "success", "message": f"Scraping selesai. {total_count} baru, {skipped_count} duplikat dilewati."}