import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import CodeBlockPage from './pages/CodeBlockPage'
import LobbyPage from './pages/LobbyPage'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/:blockId" element={<CodeBlockPage />} />
        <Route path="/" element={<LobbyPage />} />
      </Routes>
    </>
  )
}

export default App
