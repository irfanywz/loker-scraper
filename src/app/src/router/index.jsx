import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import JobsPage from '@/features/jobs/pages/JobsPage'
import SourcesPage from '@/features/sources/pages/SourcesPage'
import SettingsPage from '@/features/settings/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <JobsPage />,
        handle: { title: 'Data Lowongan' },
      },
      {
        path: 'sources',
        element: <SourcesPage />,
        handle: { title: 'Sumber' },
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        handle: { title: 'Pengaturan' },
      },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
})