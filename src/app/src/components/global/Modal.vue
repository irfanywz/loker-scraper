<script setup>
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/modalStore'; // Akan dibuat di langkah berikutnya

const modalStore = useModalStore();
const { isVisible, title, message, component, componentProps, size, actions, componentRef } = storeToRefs(modalStore);

const sizeClasses = computed(() => {
  switch (size.value) {
    case 'sm': return 'max-w-sm';
    case 'lg': return 'max-w-3xl';
    case 'xl': return 'max-w-5xl';
    case 'md':
    default:
      return 'max-w-lg';
  }
});

// Ketika komponen dinamis berubah (saat modal dibuka), simpan referensinya ke store
watch(component, (newComp) => {
  if (!newComp) {
    componentRef.value = null;
  }
});

const handleAction = (action) => {
  if (action === 'confirm') {
    modalStore.confirm();
  } else {
    modalStore.hide();
  }
};

const handleClose = () => {
  modalStore.hide();
};
</script>

<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-[10000] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="handleClose"
        aria-modal="true"
        role="dialog"
      >
        <transition name="modal-zoom">
          <div
            v-if="isVisible"
            class="bg-white rounded-lg shadow-xl w-full flex flex-col max-h-[90vh]"
            :class="sizeClasses"
          >
            <!-- Header -->
            <header class="flex-shrink-0 px-6 py-4 flex items-center justify-between border-b border-gray-200">
              <slot name="header">
                <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
              </slot>
              <button @click="handleClose" class="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <span class="icon-[carbon--close] text-2xl"></span>
              </button>
            </header>

            <!-- Body -->
            <main class="flex-auto p-6 overflow-y-auto">
              <slot name="body">
                <!-- Render dynamic component if provided -->
                <p v-if="message" class="text-sm text-gray-600">{{ message }}</p>
                <component v-else-if="component" :is="component" v-bind="componentProps" ref="componentRef" />
              </slot>
            </main>

            <!-- Footer -->
            <footer v-if="actions.length > 0" class="flex-shrink-0 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
              <slot name="footer">
                <button
                  v-for="(btn, index) in actions"
                  :key="index"
                  @click="handleAction(btn.action)"
                  type="button"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                    btn.class || 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ btn.label }}
                </button>
              </slot>
            </footer>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-zoom-enter-active {
  transition: all 0.25s cubic-bezier(0.5, 0, 0.5, 1);
}
.modal-zoom-leave-active {
  transition: all 0.2s cubic-bezier(0.5, 0, 0.5, 1);
}
.modal-zoom-enter-from,
.modal-zoom-leave-to {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
.icon-\[carbon--close\] {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='currentColor' d='M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z'/%3E%3C/svg%3E");
}
</style>