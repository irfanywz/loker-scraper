import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const message = ref('');
  const type = ref('success'); // 'success' atau 'error'
  const visible = ref(false);
  let timeoutId = null;

  function showNotification(newMessage, newType = 'success', duration = 4000) {
    message.value = newMessage;
    type.value = newType;
    visible.value = true;

    // Hapus timeout yang ada jika notifikasi baru muncul
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Sembunyikan notifikasi secara otomatis setelah beberapa detik
    timeoutId = setTimeout(() => {
      hideNotification();
    }, duration);
  }

  function hideNotification() {
    visible.value = false;
  }

  return { message, type, visible, showNotification, hideNotification };
});