import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const navItems = [
    { path: '/', label: 'Data', icon: 'icon-[carbon--data-table]' },
    { path: '/sources', label: 'Sumber', icon: 'icon-[carbon--flow-stream]' },
    { path: '/settings', label: 'Pengaturan', icon: 'icon-[carbon--settings]' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <span className="hidden sm:block text-lg font-bold text-gray-900">Loker Scraper</span>
          </div>
          
          {/* Center: Menu Items */}
          <div className="flex-1 flex justify-center h-full">
            <div className="flex space-x-2 sm:space-x-8 h-full">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-full ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  <span className={`${item.icon} text-xl`} />
                  <span className="hidden md:ml-2 md:block">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: App Version */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">v1.0.0</span>
          </div>
        </div>
      </div>
    </nav>
  )
}