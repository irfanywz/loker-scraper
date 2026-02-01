<script setup>
import { storeToRefs } from 'pinia';
import { useAlertStore } from '@/stores/alertStore';

const alertStore = useAlertStore();
const { isVisible, title, message, type, actions } = storeToRefs(alertStore);

const handleAction = (action) => {
  if (action === 'confirm') {
    alertStore.confirm();
  } else {
    alertStore.hide();
  }
};

const handleClose = () => {
  alertStore.hide();
};
</script>

<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-[10001] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="handleClose"
        aria-modal="true"
        role="dialog"
      >
        <transition name="modal-zoom">
          <div
            v-if="isVisible"
            class="bg-white rounded-lg shadow-xl w-full max-w-xs text-center p-6"
          >
            <!-- Icon -->
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full" :class="type === 'success' ? 'bg-green-100' : 'bg-red-100'">
              <span v-if="type === 'success'" class="icon-[carbon--checkmark] h-6 w-6 text-green-600"></span>
              <span v-else class="icon-[carbon--close] h-6 w-6 text-red-600"></span>
            </div>

            <!-- Body -->
            <main class="mt-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ title }}</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">{{ message }}</p>
              </div>
            </main>

            <!-- Footer -->
            <footer v-if="actions.length > 0" class="mt-5 sm:mt-6">
              <button
                v-for="(btn, index) in actions"
                :key="index"
                @click="handleAction(btn.action)"
                type="button"
                :class="[
                  'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm',
                  btn.class
                ]"
              >
                {{ btn.label }}
              </button>
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
.modal-zoom-enter-active,
.modal-zoom-leave-active {
  transition: all 0.25s cubic-bezier(0.5, 0, 0.5, 1);
}
.modal-zoom-enter-from,
.modal-zoom-leave-to {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>