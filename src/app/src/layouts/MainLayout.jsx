import { Outlet, useMatches } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'

export default function MainLayout() {
  const matches = useMatches()

  useEffect(() => {
    // Ambil match paling spesifik (terakhir) yang memiliki handle.title
    const currentMatch = matches.findLast((match) => match.handle?.title)
    const title = currentMatch?.handle?.title
    
    document.title = title ? `${title}` : 'Loker Scraper'
  }, [matches])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}