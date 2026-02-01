export default function SourceList({ sources, onEdit, onDelete, onTest, testingId, onToggleActive }) {
  if (sources.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-500">
        <span className="icon-[carbon--folder-open] text-4xl mb-3 block mx-auto text-gray-400" />
        <p>Belum ada data target. Silakan tambahkan baru.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-200">
        {sources.map((source) => {
          const isTesting = testingId === source.id
          
          return (
          <div key={source.id} className={`p-6 hover:bg-gray-50 transition group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${source.active === false ? 'opacity-75 bg-gray-50/50' : ''}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer" title={source.active === false ? "Aktifkan" : "Nonaktifkan"}>
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={source.active !== false}
                    onChange={() => onToggleActive(source)}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>

                <h4 className="font-medium text-gray-900 truncate">{source.name}</h4>
                {source.last_check_status && (
                  <span 
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      source.last_check_status === 'success' 
                        ? 'bg-green-50 text-green-700 ring-green-600/20' 
                        : 'bg-red-50 text-red-700 ring-red-600/10'
                    }`}
                  >
                    {source.last_check_status === 'success' ? 'Active' : 'Failed'}
                  </span>
                )}
              </div>
              <a href={source.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline mt-1 block truncate">
                {source.url}
              </a>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200 truncate max-w-xs">
                  {source.config?.container || source.selector || 'No config'}
                </span>
                {source.last_check_time && (
                  <span className="text-xs text-gray-500 flex items-center gap-1" title={source.last_check_message}>
                    <span className="icon-[carbon--time]" />
                    {source.last_check_time}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onTest(source)}
                disabled={isTesting}
                className={`p-2 rounded-lg transition cursor-pointer ${isTesting ? 'text-gray-400 bg-gray-100' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                title="Test Scrape"
              >
                {isTesting ? (
                  <span className="icon-[carbon--circle-dash] animate-spin text-lg" />
                ) : (
                  <span className="icon-[carbon--play-filled] text-lg" />
                )}
              </button>
              <button 
                onClick={() => onEdit(source)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                title="Ubah"
              >
                <span className="icon-[carbon--edit] text-lg" />
              </button>
              <button 
                onClick={() => onDelete(source.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                title="Hapus"
              >
                <span className="icon-[carbon--trash-can] text-lg" />
              </button>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}