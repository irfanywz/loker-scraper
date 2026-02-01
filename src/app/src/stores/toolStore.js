import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchTools as fetchToolsApi } from '../services';

export const useToolStore = defineStore('tool', () => {
  const tools = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchTools() {
    loading.value = true;
    error.value = null;
    try {
      // Use the new service to fetch data
      tools.value = await fetchToolsApi();
    } catch (e) {
      error.value = e.message;
      // Anda juga bisa memicu notifikasi error di sini jika Anda punya store notifikasi global
      // notificationStore.showNotification(e.message, 'error');
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  return { tools, loading, error, fetchTools };
});