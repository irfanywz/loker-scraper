import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', () => {
  const isVisible = ref(false);
  const title = ref('');
  const message = ref(''); // State baru untuk pesan teks
  const component = ref(null); // Untuk menampilkan komponen di dalam modal
  const componentProps = ref({}); // Props untuk komponen dinamis
  const size = ref('md'); // sm, md, lg, xl
  const actions = ref([]); // Tombol-tombol di footer
  const onConfirmCallback = ref(null); // Callback untuk aksi utama
  const componentRef = ref(null); // Untuk menyimpan referensi komponen dinamis

  /**
   * Menampilkan modal dengan opsi yang diberikan.
   * @param {object} options
   * @param {string} [options.title=''] - Judul modal.
   * @param {string} [options.message=''] - Pesan teks sederhana untuk ditampilkan.
   * @param {object} [options.component=null] - Komponen Vue untuk dirender di body.
   * @param {object} [options.props={}] - Props untuk komponen dinamis.
   * @param {string} [options.size='md'] - Ukuran modal (sm, md, lg, xl).
   * @param {Array} [options.actions=[]] - Array objek untuk tombol footer. e.g., [{ label: 'Simpan', class: 'bg-indigo-600', action: 'confirm' }]
   * @param {Function} [options.onConfirm=null] - Fungsi yang akan dipanggil saat tombol 'confirm' ditekan.
   */
  function show(options = {}) {
    title.value = options.title || '';
    message.value = options.message || '';
    component.value = options.component || null;
    componentProps.value = options.props || {};
    size.value = options.size || 'md';
    actions.value = options.actions || [];
    onConfirmCallback.value = options.onConfirm || null;
    isVisible.value = true;
  }

  function hide() {
    isVisible.value = false;
    // Reset state setelah animasi transisi selesai
    setTimeout(() => {
      title.value = '';
      message.value = '';
      component.value = null;
      componentProps.value = {};
      size.value = 'md';
      actions.value = [];
      onConfirmCallback.value = null;
      componentRef.value = null;
    }, 200);
  }

  function confirm() {
    // Panggil onConfirm dengan objek yang berisi referensi komponen
    if (typeof onConfirmCallback.value === 'function') {
      onConfirmCallback.value({ componentRef: componentRef.value });
    }
    hide(); // Tetap tutup modal setelah konfirmasi
  }

  return { isVisible, title, message, component, componentProps, size, actions, componentRef, show, hide, confirm };
});