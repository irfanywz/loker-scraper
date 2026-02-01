import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const typeConfigs = {
  info: {
    icon: 'icon-[carbon--information]',
    iconColor: 'text-blue-500',
    confirmColor: 'bg-blue-600 hover:bg-blue-700',
  },
  success: {
    icon: 'icon-[carbon--checkmark-outline]',
    iconColor: 'text-green-500',
    confirmColor: 'bg-green-600 hover:bg-green-700',
  },
  warning: {
    icon: 'icon-[carbon--warning-alt]',
    iconColor: 'text-yellow-500',
    confirmColor: 'bg-yellow-600 hover:bg-yellow-700',
  },
  error: {
    icon: 'icon-[carbon--error]',
    iconColor: 'text-red-500',
    confirmColor: 'bg-red-600 hover:bg-red-700',
  },
};

export const useDialogStore = defineStore('dialog', () => {
  const isOpen = ref(false);
  const title = ref('');
  const message = ref('');
  const type = ref('info');
  const options = ref({
    confirmText: 'Confirm',
    cancelText: 'Cancel', // Default for confirmations
  });

  let resolvePromise = null;

  function show(opts) {
    title.value = opts.title;
    message.value = opts.message;
    type.value = opts.type || 'info';

    // Set default confirm/cancel text based on whether it's an alert or a confirmation
    const defaultOptions = {
      confirmText: opts.cancelText === undefined ? 'OK' : 'Confirm',
      cancelText: opts.cancelText || 'Cancel',
    };
    options.value = { ...defaultOptions, ...typeConfigs[type.value], ...opts };
    isOpen.value = true;

    return new Promise((resolve) => {
      resolvePromise = resolve;
    });
  }

  function handleConfirm() {
    if (resolvePromise) resolvePromise(true);
    isOpen.value = false;
  }

  function handleCancel() {
    if (resolvePromise) resolvePromise(false);
    isOpen.value = false;
  }

  const typeConfig = computed(() => typeConfigs[type.value]);

  return { isOpen, title, message, options, type, typeConfig, show, handleConfirm, handleCancel };
});