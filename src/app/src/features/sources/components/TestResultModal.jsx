import { useEffect } from 'react'

export default function TestResultModal({ isOpen, onClose, result }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen || !result) return null

  const { status, message, data } = result
  const isSuccess = status === 'success'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-gray-900/50 transition-opacity backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className={`px-6 py-4 border-b border-gray-200 flex justify-between items-center ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
          <div>
            <h3 className={`text-lg font-semibold ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
              {isSuccess ? 'Test Berhasil' : 'Test Gagal'}
            </h3>
            <p className={`text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="icon-[carbon--close] text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {isSuccess && data && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 uppercase font-medium">Items Found</div>
                  <div className="text-2xl font-bold text-gray-900">{data.count}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 uppercase font-medium">Pagination</div>
                  <div className={`text-lg font-bold ${data.pagination ? 'text-green-600' : 'text-gray-400'}`}>
                    {data.pagination ? 'Detected' : 'Not Found'}
                  </div>
                </div>
              </div>

              {/* Samples Table */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Data Preview (Max 3)</h4>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Title</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Link</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Metadata</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {data.samples?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 font-medium text-gray-900">{item.title || '-'}</td>
                          <td className="px-4 py-2 text-blue-600 truncate max-w-xs">{item.link || '-'}</td>
                          <td className="px-4 py-2 text-gray-500">
                            {item.metadata ? (
                              <pre className="text-xs bg-gray-50 p-1 rounded">{JSON.stringify(item.metadata, null, 2)}</pre>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex justify-end border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}