import { useState, useEffect, useCallback } from 'react'
import { sourceService } from '../services/sourceService'
import Dialog from '@/components/global/Dialog'
import SourceList from '../components/SourceList'
import SourceFormModal from '../components/SourceFormModal'
import TestResultModal from '../components/TestResultModal'
import { useToast } from '@/components/global/Toast'

export default function SourcesPage() {
  const [sources, setSources] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSource, setEditingSource] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null })
  const [testingId, setTestingId] = useState(null)
  const [testResult, setTestResult] = useState(null)
  
  // Panggil hook toast
  const toast = useToast()

  const fetchSources = useCallback(async () => {
    try {
      const response = await sourceService.getAll()
      if (response && response.data) {
        setSources(response.data)
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error)
    }
  }, [])

  // Fetch data saat halaman dimuat
  useEffect(() => {
    fetchSources()
  }, [fetchSources])

  const handleOpenCreate = () => {
    setEditingSource(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (source) => {
    setEditingSource(source)
    setIsFormOpen(true)
  }

  const handleSave = async (formData) => {
    setIsLoading(true)
    try {
      if (editingSource) {
        await sourceService.update(editingSource.id, formData)
        toast.success('Sumber berhasil diperbarui!')
      } else {
        await sourceService.create(formData)
        toast.success('Sumber berhasil ditambahkan!')
      }
      setIsFormOpen(false)
      await fetchSources()
    } catch (error) {
      toast.error('Gagal menyimpan: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDelete = (id) => {
    setDeleteModal({ open: true, id })
  }

  const handleDelete = async () => {
    try {
      await sourceService.delete(deleteModal.id)
      await fetchSources()
      toast.success('Sumber berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus: ' + error.message)
    } finally {
      setDeleteModal({ open: false, id: null })
    }
  }

  const handleTest = async (source) => {
    setTestingId(source.id)
    toast.info(`Sedang mengetes ${source.name}...`)
    try {
      const result = await sourceService.test(source)
      setTestResult(result)
      await fetchSources()
    } catch (error) {
      toast.error('Test gagal: ' + error.message)
    } finally {
      setTestingId(null)
    }
  }

  const handleTestAll = async () => {
    if (sources.length === 0) return
    setIsLoading(true)
    toast.info('Memulai pengujian semua sumber...')
    try {
      const response = await sourceService.testAll()
      const results = response.data
      const passed = results.filter(r => r.status === 'success').length
      const failed = results.length - passed
      
      if (failed === 0) {
        toast.success(`Semua ${passed} sumber valid!`)
      } else {
        toast.error(`${passed} sukses, ${failed} gagal.`)
      }
      await fetchSources()
    } catch (error) {
      toast.error('Gagal menjalankan test all: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (source) => {
    try {
      const isActive = source.active !== false
      await sourceService.update(source.id, { active: !isActive })
      await fetchSources()
      toast.success(!isActive ? 'Sumber diaktifkan' : 'Sumber dinonaktifkan')
    } catch (error) {
      toast.error('Gagal mengubah status: ' + error.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sumber</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola target website yang akan di-scrape.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleTestAll}
            disabled={isLoading || sources.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <span className="icon-[carbon--play-outline] text-lg" />
            Test All
          </button>
          <button
            onClick={handleOpenCreate}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <span className="icon-[carbon--add] text-lg" />
            Tambah
          </button>
        </div>
      </div>

      <SourceList 
        sources={sources} 
        onEdit={handleOpenEdit} 
        onDelete={confirmDelete} 
        onTest={handleTest}
        testingId={testingId}
        onToggleActive={handleToggleActive}
      />

      <SourceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSave}
        initialData={editingSource}
        isLoading={isLoading}
      />

      <TestResultModal
        isOpen={!!testResult}
        onClose={() => setTestResult(null)}
        result={testResult}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Hapus Sumber"
        type="danger"
        footer={
          <>
            <button
              onClick={handleDelete}
              className="inline-flex w-full justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto cursor-pointer"
            >
              Ya, Hapus
            </button>
            <button
              onClick={() => setDeleteModal({ open: false, id: null })}
              className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
            >
              Batal
            </button>
          </>
        }
      >
        <p>Apakah Anda yakin ingin menghapus sumber ini? Data yang sudah dihapus tidak dapat dikembalikan.</p>
      </Dialog>
    </div>
  )
}