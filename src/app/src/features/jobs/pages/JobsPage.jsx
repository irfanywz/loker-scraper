import { useState, useEffect, useCallback } from 'react'
import { jobService } from '../services/jobService'
import { useToast } from '@/components/global/Toast'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [metadataKeys, setMetadataKeys] = useState([])
  const [filters, setFilters] = useState({})
  
  const toast = useToast()

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await jobService.getAll()
      if (response && response.data) {
        setJobs(response.data)
        setFilteredJobs(response.data)
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  useEffect(() => {
    // Extract unique metadata keys
    const keys = new Set()
    jobs.forEach(job => {
      if (job.metadata) {
        Object.keys(job.metadata).forEach(k => keys.add(k))
      }
    })
    setMetadataKeys(Array.from(keys).sort())
  }, [jobs])

  useEffect(() => {
    let result = jobs

    // 1. Global Search
    if (search) {
      const lower = search.toLowerCase()
      result = result.filter(job => 
        job.title?.toLowerCase().includes(lower) || 
        job.source_name?.toLowerCase().includes(lower) ||
        JSON.stringify(job.metadata || {}).toLowerCase().includes(lower)
      )
    }

    // 2. Metadata Filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const lowerValue = value.toLowerCase()
        result = result.filter(job => {
          const metaValue = job.metadata?.[key]
          return metaValue && String(metaValue).toLowerCase().includes(lowerValue)
        })
      }
    })

    setFilteredJobs(result)
  }, [search, jobs, filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleScrape = async () => {
    setIsLoading(true)
    toast.info('Memulai proses scraping...')
    try {
      const response = await jobService.scrape()
      toast.success(response.message)
      await fetchJobs()
    } catch (error) {
      toast.error('Gagal scraping: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Lowongan</h1>
          <p className="text-gray-500 text-sm mt-1">Monitoring hasil scraping dari berbagai sumber.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleScrape}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <span className="icon-[carbon--cloud-download] text-lg" />
            Scrape Now
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border border-gray-300 font-medium rounded-lg text-sm transition cursor-pointer flex items-center gap-2 ${showFilters ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <span className="icon-[carbon--filter] text-lg" />
            Filter
          </button>
          <input 
            type="text" 
            placeholder="Cari lowongan..." 
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            onClick={fetchJobs}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Filter Metadata</h3>
            <button onClick={() => setFilters({})} className="text-xs text-red-600 hover:underline cursor-pointer">Reset Filter</button>
          </div>
          {metadataKeys.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Tidak ada metadata yang tersedia untuk difilter.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {metadataKeys.map(key => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{key}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder={`Filter ${key}...`}
                    value={filters[key] || ''}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-3">Judul & Info</th>
                <th className="px-6 py-3">Sumber</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    {isLoading ? 'Memuat data...' : 'Tidak ada data lowongan ditemukan.'}
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-gray-900 text-base mb-1">
                        <a href={job.link} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:underline">
                          {job.title}
                        </a>
                      </div>
                      <div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                        <span className="icon-[carbon--calendar]" />
                        {job.created_at || '-'}
                      </div>
                      
                      {/* Metadata Section */}
                      {job.metadata && (
                        <div className="space-y-1">
                          {Object.entries(job.metadata).map(([key, value]) => (
                            <div key={key} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="font-medium text-gray-500 capitalize min-w-[80px]">{key}:</span> 
                              <span className="flex-1">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {job.source_name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right align-top">
                      <a 
                        href={job.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        Buka <span className="icon-[carbon--launch]" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}