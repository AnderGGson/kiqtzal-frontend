import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { LandingPage } from '../pages/LandingPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ExperimentPage } from '../pages/ExperimentPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/experiments/:id', element: <ExperimentPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])