import { useState, useEffect } from 'react'

export default function SourceFormModal({ isOpen, onClose, onSubmit, initialData, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    config: {
      container: '',
      title: '',
      link: '',
      pagination: '',
      max_pages: 3,
      metadata: []
    }
  })

  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          url: initialData.url || '',
          config: initialData.config || {
            container: initialData.selector || '', // Fallback untuk data lama
            title: '',
            link: '',
            pagination: '',
            max_pages: initialData.config?.max_pages || 3,
            metadata: []
          }
        })
      } else {
        setFormData({ name: '', url: '', config: { container: '', title: '', link: '', pagination: '', max_pages: 3, metadata: [] } })
      }
    }
  }, [isOpen, initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleConfigChange = (field, value) => {
    setFormData(prev => ({ ...prev, config: { ...prev.config, [field]: value } }))
  }

  const addMetadata = () => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, metadata: [...prev.config.metadata, { key: '', selector: '', attribute: '' }] }
    }))
  }

  const removeMetadata = (index) => {
    const newMeta = formData.config.metadata.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, config: { ...prev.config, metadata: newMeta } }))
  }

  const updateMetadata = (index, field, value) => {
    const newMeta = [...formData.config.metadata]
    newMeta[index][field] = value
    setFormData(prev => ({ ...prev, config: { ...prev.config, metadata: newMeta } }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/50 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Panel */}
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        {/* Header (Fixed) */}
        <div className="px-6 py-4 border-b border-gray-200 shrink-0">
          <h3 className="text-lg font-semibold leading-6 text-gray-900">
            {initialData ? 'Ubah Target' : 'Tambah Target Baru'}
          </h3>
        </div>
        
        {/* Body (Scrollable) */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <form id="source-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Website</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Contoh: LinkedIn Jobs"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Target</label>
              <input
                type="url"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Konfigurasi Selector</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Container (Loop Item)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    placeholder=".job-card"
                    value={formData.config.container}
                    onChange={(e) => handleConfigChange('container', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pagination (Next Button)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    placeholder=".next-page"
                    value={formData.config.pagination}
                    onChange={(e) => handleConfigChange('pagination', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max Pages</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    value={formData.config.max_pages}
                    onChange={(e) => handleConfigChange('max_pages', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title Selector</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    placeholder=".job-title"
                    value={formData.config.title}
                    onChange={(e) => handleConfigChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link Selector</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    placeholder="a.job-link"
                    value={formData.config.link}
                    onChange={(e) => handleConfigChange('link', e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-medium text-gray-700">Metadata Tambahan</label>
                  <button type="button" onClick={addMetadata} className="text-xs text-blue-600 hover:underline cursor-pointer">+ Tambah Field</button>
                </div>
                {formData.config.metadata.map((meta, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input type="text" placeholder="Key" className="w-1/4 px-2 py-1 border border-gray-300 rounded text-sm" value={meta.key} onChange={(e) => updateMetadata(idx, 'key', e.target.value)} />
                    <input type="text" placeholder="Selector" className="w-2/4 px-2 py-1 border border-gray-300 rounded text-sm font-mono" value={meta.selector} onChange={(e) => updateMetadata(idx, 'selector', e.target.value)} />
                    <input type="text" placeholder="Attr (opt)" className="w-1/4 px-2 py-1 border border-gray-300 rounded text-sm font-mono" value={meta.attribute || ''} onChange={(e) => updateMetadata(idx, 'attribute', e.target.value)} />
                    <button type="button" onClick={() => removeMetadata(idx)} className="text-red-500 hover:text-red-700 px-1"><span className="icon-[carbon--trash-can]" /></button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer (Fixed) */}
        <div className="px-6 py-4 border-t border-gray-200 shrink-0 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            form="source-form"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}