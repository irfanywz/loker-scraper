import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

let toastId = 0

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 3000)
  }, [removeToast])

  const success = (msg) => addToast(msg, 'success')
  const error = (msg) => addToast(msg, 'error')
  const info = (msg) => addToast(msg, 'info')

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg text-white transition-all transform translate-y-0 opacity-100 animate-in slide-in-from-right duration-300 ${
              toast.type === 'success' ? 'bg-green-600' :
              toast.type === 'error' ? 'bg-red-600' :
              'bg-blue-600'
            }`}
            role="alert"
          >
            <div className="text-sm font-medium">{toast.message}</div>
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 text-white hover:bg-white/20 transition"
              onClick={() => removeToast(toast.id)}
            >
              <span className="icon-[carbon--close] text-lg" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}