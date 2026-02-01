import { ref } from 'vue';
import { fetchSetting } from '../services';

// Cache sederhana di dalam modul untuk menyimpan data selama sesi aplikasi berjalan
let cachedAppInfo = null;

/**
 * Composable function untuk mengambil dan mengelola data informasi aplikasi.
 * Data akan diambil dari API sekali, lalu disimpan di cache untuk pemanggilan berikutnya.
 */
export function useAppInfo() {
  
  const appInfo = ref({
    name: 'Content Maker',
    version: '1.0.0',
    description: 'Loading application details...',
    author: '...',
    icon: ''
  });

  const fetchAppInfo = async () => {
    // Jika data sudah ada di cache, gunakan itu dan jangan panggil API lagi
    if (cachedAppInfo) {
      appInfo.value = cachedAppInfo;
      return;
    }

    try {
      const data = await fetchSetting('app_info');
      appInfo.value = data;
      cachedAppInfo = data; // Simpan data ke cache setelah berhasil diambil
    } catch (error) {
      console.error('Error fetching app info:', error);
      appInfo.value.description = 'Could not load application details from the server.';
    }
  };

  return { appInfo, fetchAppInfo };
}