import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', () => {
  const isVisible = ref(false);
  const title = ref('');
  const message = ref('');
  const type = ref('success'); // 'success' atau 'error'
  const actions = ref([]);
  let onConfirmCallback = null;

  function show(options = {}) {
    title.value = options.title || '';
    message.value = options.message || '';
    type.value = options.type || 'success';
    actions.value = options.actions || [{ label: 'OK', action: 'confirm', class: 'bg-indigo-600 hover:bg-indigo-700 text-white' }];
    onConfirmCallback = options.onConfirm || null;
    isVisible.value = true;
  }

  function hide() {
    isVisible.value = false;
    title.value = '';
    message.value = '';
    type.value = 'success';
    actions.value = [];
    onConfirmCallback = null;
  }

  function confirm() {
    if (typeof onConfirmCallback === 'function') {
      onConfirmCallback();
    }
    hide();
  }

  return { isVisible, title, message, type, actions, show, hide, confirm };
});