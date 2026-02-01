import { ref } from 'vue';
import { defineStore } from 'pinia';
import { apiFetch } from '@/services/api-client';

export const useAppStore = defineStore('app', () => {
  // Initialize with values from environment variables as a fallback
  const appName = ref(import.meta.env.VITE_APP_NAME || 'App');
  const appVersion = ref(import.meta.env.VITE_APP_VERSION || '1.0.0');

  /**
   * Fetches application information from the backend.
   */
  async function fetchAppInfo() {
    try {
      // Assuming an endpoint `/api/app-info` that returns { name: '...', version: '...' }
      const data = await apiFetch('/api/app-info');
      if (data.name) {
        appName.value = data.name;
      }
      if (data.version) {
        appVersion.value = data.version;
      }
    } catch (error) {
      console.error('Failed to fetch app info:', error);
      // The store will retain the fallback values from the environment variables.
    }
  }

  return { appName, appVersion, fetchAppInfo };
});