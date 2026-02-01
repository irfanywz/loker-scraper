<script setup>
import { computed, onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';

const notificationStore = useNotificationStore();

onMounted(() => {
  window.eventBus.on('show-notification', ({ message, type, duration }) => {
    notificationStore.showNotification(message, type, duration);
  });
});

const notificationClasses = computed(() => {
  return {
    'bg-green-500 text-white': notificationStore.type === 'success',
    'bg-red-500 text-white': notificationStore.type === 'error' || notificationStore.type === 'danger',
    'bg-blue-500 text-white': notificationStore.type === 'info',
    'bg-yellow-400 text-gray-800': notificationStore.type === 'warning',
  };
});

const notificationIcon = computed(() => {
  switch (notificationStore.type) {
    case 'success':
      return 'icon-[carbon--checkmark-outline]';
    case 'error':
    case 'danger':
      return 'icon-[carbon--error]';
    case 'info':
      return 'icon-[carbon--information]';
    case 'warning':
      return 'icon-[carbon--warning-alt]';
    default:
      return '';
  }
});
</script>

<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform opacity-0 translate-y-2"
    enter-to-class="transform opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform opacity-100 translate-y-0"
    leave-to-class="transform opacity-0 translate-y-2"
  >
    <div v-if="notificationStore.visible" 
         class="fixed top-5 right-5 z-50 flex items-center px-6 py-3 rounded-lg shadow-lg text-sm font-medium"
         :class="notificationClasses">
      <div :class="notificationIcon" class="mr-3 text-xl flex-shrink-0"></div>
      <span>
        {{ notificationStore.message }}
      </span>
    </div>
  </transition>
</template>
