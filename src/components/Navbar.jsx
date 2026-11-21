import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header class="navbar">

      <div class="logo-container">
        <img src="/images/LOGO.jpeg" alt="Letras & Aromas" />
        <div>
          <h2>Letras & Aromas</h2>
          <span>Historias que iluminan</span>
        </div>
      </div>

      <nav class="navegacion" aria-label="Menú principal">
        <NavLink to="/" className="nav-boton activo" aria-current="page">
          Inicio
        </NavLink>
        <NavLink to="/catalogo" className="nav-boton">
          Catálogo
        </NavLink>
        <NavLink to="/nosotros" className="nav-boton">
          Nosotros
        </NavLink>
      </nav>

<div class="acciones">

        <button
          type="button"
          class="icono usuario-btn"
          onclick="abrirLogin()"
          aria-label="Iniciar sesión"
          title="Mi cuenta">

          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true">

            <circle cx="12" cy="8" r="4"></circle>
            <path d="M4 21a8 8 0 0 1 16 0"></path>

          </svg>

          <span id="contador">0</span>
        </button>

        <button
          type="button"
          class="icono carrito-btn"
          onclick="mostrarCarrito()"
          aria-label="Abrir carrito de compras"
          title="Mi carrito">

          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true">

            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"></path>

          </svg>
        </button>
      </div>
    </header>
  )
}

export default Navbar