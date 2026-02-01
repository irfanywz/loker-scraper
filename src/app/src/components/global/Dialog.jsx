import { useEffect } from 'react'

export default function Dialog({ isOpen, onClose, title, children, footer, type = 'default' }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/50 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Dialog Panel */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 animate-in fade-in zoom-in duration-200">
        <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            {type === 'danger' && (
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 mb-4 sm:mb-0">
                <span className="icon-[carbon--warning-filled] text-red-600 text-xl" />
              </div>
            )}
            <div className={`mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full ${type !== 'danger' ? 'ml-0' : ''}`}>
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                {title}
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                {children}
              </div>
            </div>
          </div>
        </div>
        {footer && (
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}