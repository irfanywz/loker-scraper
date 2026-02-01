import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchSetting } from '../services';

export const useSettingsStore = defineStore('settings', () => {
  // State
  const externalLinks = ref([]);
  const hasFetched = ref(false); // Flag to mark if a fetch has been attempted in this session

  // Actions
  async function fetchExternalLinks() {
    // If already fetched in this session, don't do it again.
    if (hasFetched.value) {
      return;
    }

    const cacheKey = 'externalLinksCache';
    const cacheDuration = 60 * 60 * 1000; // 1 hour

    // Try to get from localStorage first
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      if (Date.now() - timestamp < cacheDuration) {
        externalLinks.value = data;
        hasFetched.value = true; // Mark as fetched since we are using valid cache
        return;
      }
    }

    // If no valid cache, fetch from API
    try {
      const data = await fetchSetting('external_links');
      externalLinks.value = data;
      hasFetched.value = true;
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (error) {
      console.error('Failed to load external links:', error);
      // Optionally re-throw or handle the error for the UI
    }
  }

  return { externalLinks, fetchExternalLinks };
});