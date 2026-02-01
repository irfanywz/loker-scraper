import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ToastProvider } from './components/global/Toast'

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} 
      future={{
        v7_startTransition: true,
      }}
      />
    </ToastProvider>
  )
}

export default App
