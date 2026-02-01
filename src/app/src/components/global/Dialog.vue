<script setup>
import { useDialogStore } from '@/stores/dialogStore';
import { watch, onUnmounted } from 'vue';

const dialogStore = useDialogStore();

// Preload icons to ensure they are available in production builds
const icons = 'icon-[carbon--information] icon-[carbon--checkmark-outline] icon-[carbon--warning-alt] icon-[carbon--error]';

/**
 * Handles the keydown event to close the dialog on 'Escape'.
 * @param {KeyboardEvent} event
 */
function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    dialogStore.handleCancel();
  }
}

watch(() => dialogStore.isOpen, (isOpen) => {
  if (isOpen) {
    window.addEventListener('keydown', handleEscapeKey);
  } else {
    window.removeEventListener('keydown', handleEscapeKey);
  }
});

// Clean up the event listener when the component is unmounted to prevent memory leaks.
onUnmounted(() => {
  window.removeEventListener('keydown', handleEscapeKey);
});
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="dialogStore.isOpen" @click="dialogStore.handleCancel" class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 backdrop-blur-sm p-4 transition-opacity duration-200 ease-out">
        <div @click.stop class="bg-white rounded-lg shadow-xl w-full max-w-md transition-all duration-200 ease-out" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <div class="p-6 flex items-start gap-4">
            <div class="flex-shrink-0 text-3xl" :class="dialogStore.typeConfig.iconColor">
              <div :class="dialogStore.typeConfig.icon"></div>
            </div>
            <div class="flex-grow">
              <h3 class="text-lg font-medium text-gray-900" id="dialog-title">{{ dialogStore.title }}</h3>
              <p class="mt-1 text-sm text-gray-600">{{ dialogStore.message }}</p>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button @click="dialogStore.handleConfirm" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm transition-colors" :class="dialogStore.options.confirmColor">
              {{ dialogStore.options.confirmText }}
            </button>
            <button v-if="dialogStore.options.cancelText" @click="dialogStore.handleCancel" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm transition-colors">
              {{ dialogStore.options.cancelText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style>
/* Backdrop transition */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dialog box transition */
.fade-enter-from .bg-white,
.fade-leave-to .bg-white {
  opacity: 0;
  transform: scale(0.95);
}
</style>