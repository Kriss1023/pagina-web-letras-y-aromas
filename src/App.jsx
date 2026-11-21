import React from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Nosotros from './pages/Nosotros'
import Admin from './pages/Admin'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <Router>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />

      </Routes>

      <Footer />
    </Router>
  )
}

export default App