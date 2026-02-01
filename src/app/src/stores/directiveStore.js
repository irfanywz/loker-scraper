import { useTooltipStore } from '@/stores/tooltipStore';

export const vTooltip = {
  mounted(el, binding) {
    const store = useTooltipStore();

    const showTooltip = (event) => {
      // Don't show tooltip if the element is disabled
      if (el.disabled) return;

      const isObjectBinding = typeof binding.value === 'object' && binding.value !== null;
      const content = isObjectBinding ? binding.value.content : binding.value;
      const delay = isObjectBinding ? binding.value.delay ?? 3000 : 3000;

      // Don't show if there's no content
      if (!content) return;

      // *** FIX: Proactively clear any lingering timeout before creating a new one. ***
      store.clearTooltipShowTimeout();

      // Clone the event object to preserve its properties inside setTimeout
      const eventClone = {
        currentTarget: event.currentTarget,
        clientX: event.clientX,
        clientY: event.clientY,
      };
      
      // Set a timeout to show the tooltip
      store.setTooltipShowTimeout(setTimeout(() => store.show(content, eventClone), delay));
    };

    const hideTooltip = () => {
      // Clear the timeout if the user moves away before it's shown
      store.clearTooltipShowTimeout();
      store.hide();
    };

    el.addEventListener('mouseenter', showTooltip);
    el.addEventListener('mouseleave', hideTooltip);
    el.addEventListener('focus', showTooltip);
    el.addEventListener('blur', hideTooltip);
  },
  unmounted(el, binding) {
    // Ensure tooltip is hidden and timeout is cleared when the element is removed
    const store = useTooltipStore();
    store.hide();
  }
};
