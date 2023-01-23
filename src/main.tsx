import React from 'react'
import AppLobby from './pages/AppLobby'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CodeBlockPage from './pages/CodeBlockPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLobby />,
  },
  {
    path: '/:blockId',
    element: <CodeBlockPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
