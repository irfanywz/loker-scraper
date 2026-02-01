import { useState, useRef, useEffect } from 'react'
import { settingService } from '../services/settingService'
import { useToast } from '@/components/global/Toast'
import Dialog from '@/components/global/Dialog'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const fileInputRef = useRef(null)
  const toast = useToast()

  // Scheduler State
  const [schedulerConfig, setSchedulerConfig] = useState({
    auto_scrape: false,
    scrape_interval: 60,
    last_run: null
  })

  useEffect(() => {
    loadSchedulerConfig()
  }, [])

  const loadSchedulerConfig = async () => {
    try {
      const res = await settingService.getSchedulerConfig()
      if (res.data) setSchedulerConfig(res.data)
    } catch (error) {
      console.error("Failed to load config", error)
    }
  }

  const handleSaveScheduler = async () => {
    setIsLoading(true)
    try {
      await settingService.saveSchedulerConfig({
        auto_scrape: schedulerConfig.auto_scrape,
        scrape_interval: parseInt(schedulerConfig.scrape_interval)
      })
      toast.success('Pengaturan Auto Scrape disimpan')
      await loadSchedulerConfig()
    } catch (error) {
      toast.error('Gagal menyimpan: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Export (Download JSON)
  const handleExport = async () => {
    setIsLoading(true)
    try {
      const response = await settingService.exportJobs()
      // Buat file JSON dari data
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data, null, 2))
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", "loker_backup_" + new Date().toISOString().slice(0, 10) + ".json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
      toast.success('Backup berhasil diunduh')
    } catch (error) {
      toast.error('Gagal backup: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Import (Upload JSON)
  const handleImportClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result)
        if (!Array.isArray(json)) throw new Error("Format file tidak valid (harus array)")
        
        setIsLoading(true)
        // Hapus ID lama agar database membuat ID baru (menghindari konflik)
        const cleanData = json.map(({ id, ...rest }) => rest)
        
        await settingService.importJobs(cleanData)
        toast.success('Data berhasil dipulihkan')
      } catch (error) {
        toast.error('Gagal restore: ' + error.message)
      } finally {
        setIsLoading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  // Handle Reset (Clear All)
  const handleReset = async () => {
    setIsLoading(true)
    try {
      await settingService.clearJobs()
      toast.success('Semua data lowongan berhasil dihapus')
    } catch (error) {
      toast.error('Gagal reset: ' + error.message)
    } finally {
      setIsLoading(false)
      setResetModalOpen(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Sistem</h1>
      
      {/* Scheduler Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Auto Scrape (Scheduler)</h3>
          <p className="text-sm text-gray-500 mt-1">Jalankan proses scraping secara otomatis di latar belakang.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">Aktifkan Auto Scrape</label>
              <p className="text-sm text-gray-500">Bot akan berjalan otomatis sesuai interval.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={schedulerConfig.auto_scrape}
                onChange={(e) => setSchedulerConfig({...schedulerConfig, auto_scrape: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interval (Menit)</label>
              <input 
                type="number" 
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={schedulerConfig.scrape_interval}
                onChange={(e) => setSchedulerConfig({...schedulerConfig, scrape_interval: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terakhir Dijalankan</label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
                {schedulerConfig.last_run || 'Belum pernah berjalan'}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSaveScheduler} disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer disabled:opacity-50">Simpan Pengaturan</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Manajemen Data Lowongan</h3>
          <p className="text-sm text-gray-500 mt-1">Backup, restore, atau hapus data hasil scraping.</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {/* Backup */}
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Backup Data</h4>
              <p className="text-sm text-gray-500 mt-1">Unduh semua data lowongan dalam format JSON.</p>
            </div>
            <button onClick={handleExport} disabled={isLoading} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer disabled:opacity-50">
              <span className="icon-[carbon--download] mr-2 text-lg align-middle" />
              Export JSON
            </button>
          </div>

          {/* Restore */}
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Restore Data</h4>
              <p className="text-sm text-gray-500 mt-1">Pulihkan data dari file backup JSON (Data lama akan ditimpa).</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            <button onClick={handleImportClick} disabled={isLoading} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer disabled:opacity-50">
              <span className="icon-[carbon--upload] mr-2 text-lg align-middle" />
              Import JSON
            </button>
          </div>

          {/* Reset */}
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-red-50/30">
            <div>
              <h4 className="font-medium text-red-900">Reset Data</h4>
              <p className="text-sm text-red-600 mt-1">Hapus permanen semua data lowongan yang tersimpan.</p>
            </div>
            <button onClick={() => setResetModalOpen(true)} disabled={isLoading} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition cursor-pointer disabled:opacity-50">
              Hapus Semua
            </button>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Hapus Semua Data"
        type="danger"
        footer={
          <>
            <button onClick={handleReset} className="inline-flex w-full justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto cursor-pointer">
              Ya, Hapus Semuanya
            </button>
            <button onClick={() => setResetModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer">
              Batal
            </button>
          </>
        }
      >
        <p>Tindakan ini akan menghapus <strong>semua data lowongan</strong> yang ada di database. Data yang dihapus tidak dapat dikembalikan kecuali Anda memiliki backup.</p>
      </Dialog>
    </div>
  )
}