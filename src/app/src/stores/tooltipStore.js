import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTooltipStore = defineStore('tooltip', () => {
  const isVisible = ref(false);
  const content = ref('');
  const position = ref({ top: 0, left: 0 });
  const showTimeoutId = ref(null); // Added to manage the show timeout
  const mousePosition = ref({ x: 0, y: 0 });

  function show(newContent, event) {
    if (!event || !event.currentTarget) return;
    content.value = newContent;
    mousePosition.value = { x: event.clientX, y: event.clientY };
    event.currentTarget.addEventListener('mousemove', updateMousePosition);
    event.currentTarget.addEventListener('mouseleave', hide, { once: true });
    isVisible.value = true;
  }

  function hide() {
    clearTooltipShowTimeout(); // Clear any pending show timeout
    isVisible.value = false;
    content.value = '';
    document.querySelectorAll('[v-tooltip]').forEach(el => {
      el.removeEventListener('mousemove', updateMousePosition);
    });
  }

  function setTooltipShowTimeout(timeoutId) {
    // *** FIX: Clear any existing timeout before setting a new one. ***
    clearTooltipShowTimeout();
    showTimeoutId.value = timeoutId;
  }

  function clearTooltipShowTimeout() {
    if (showTimeoutId.value) {
      clearTimeout(showTimeoutId.value);
      showTimeoutId.value = null;
    }
  }

  function updateMousePosition(event) {
    mousePosition.value = { x: event.clientX, y: event.clientY };
  }

  function updatePosition(tooltipEl) {
    if (!tooltipEl) return;

    const tooltipRect = tooltipEl.getBoundingClientRect();
    const gap = 15; // The space between the pointer and the tooltip

    let top = mousePosition.value.y - tooltipRect.height - gap;
    let left = mousePosition.value.x;

    // If tooltip goes off the top of the screen, place it below the element
    if (top < 0) {
      top = mousePosition.value.y + gap + 10; // 10 is an extra offset
    }

    // Adjust horizontal position to keep it within the viewport
    if (left + tooltipRect.width / 2 > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width / 2 - 10; // 10 is padding
    } else if (left - tooltipRect.width / 2 < 0) {
      left = tooltipRect.width / 2 + 10; // 10 is padding
    }

    position.value = { top, left };
  }

  return { isVisible, content, position, show, hide, updatePosition, updateMousePosition, setTooltipShowTimeout, clearTooltipShowTimeout };
});
