import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProductos } from '../hooks/useProductos'

function Catalogo() {
  const [tipoFiltrado, setTipoFiltrado] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tipoDeUrl = params.get('tipo')
    setTipoFiltrado(tipoDeUrl || null)
  }, [location.search])

  const { productos, loading } = useProductos(tipoFiltrado)

  if (loading) {
    return (
      <main>
        <h1 style={{ textAlign: 'center', color: '#70495f', padding: '50px 0' }}>
          Cargando productos...
        </h1>
      </main>
    )
  }

  return (
    <main>
      <section class="catalogo-encabezado">
        <span class="etiqueta">Nuestra colección</span>

        <h1>Catálogo de Letras & Aromas</h1>

        <p>Encuentra historias para leer y aromas para acompañarlas.</p>

        {/* BOTONES DE FILTRADO */}
        <div class="catalogo-filtros" role="group" aria-label="Filtrar productos">

          <button
            type="button"
            class="filtro activo"
            data-filtro="todos"
            aria-pressed="true">
            Todos
          </button>

          <button
            type="button"
            class="filtro"
            data-filtro="libros"
            aria-pressed="false">
            Libros
          </button>

          <button
            type="button"
            class="filtro"
            data-filtro="velas"
            aria-pressed="false">
            Velas
          </button>

          <button
            type="button"
            class="filtro"
            data-filtro="destacados"
            aria-pressed="false">
            Destacados
          </button>

        </div>
      </section>

      <section
        id="destacados"
        class="productos-seccion catalogo-seccion destacados">

        <div class="titulo">

          <span>Nuestra selección</span>

          <h2>Destacados</h2>

          <p>Una selección especial de historias y aromas para descubrir.</p>

        </div>

        <div
          id="productosDestacados"
          class="productos productos-destacados"
          aria-live="polite">

          <p class="catalogo-vacio">Cargando destacados...</p>

        </div>
      </section>

      <section
        id="libros"
        class="productos-seccion catalogo-seccion">

        <div class="titulo">

          <span>Nuestra colección</span>

          <h2>Libros</h2>

          <p>Historias para perderte, soñar y descubrir nuevos mundos.</p>

        </div>

        <div
          id="productosLibros"
          class="productos"
          aria-live="polite">

          {productos.map(producto => (
            <div key={producto.id} class="producto">

              <div class="producto-imagen{

                producto.tipo === 'libro' && ' libro1'
              }">

                <img
                  src={`/images/${producto.imagen}`}
                  alt={producto.nombre} />

              </div>

              <div class="producto-info">

                <span class="categoria">${producto.tipo}</span>

                <h3>{producto.nombre}</h3>

                <p>{producto.descripcion}</p>

                <div class="producto-abajo">

                  <strong>${producto.precio}</strong>

                  <button>
                    Agregar 🛒
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      </section>

      <section
        id="velas"
        class="productos-seccion catalogo-seccion velas">

        <div class="titulo">

          <span>Aromas especiales</span>

          <h2>Velas</h2>

          <p>Aromas para acompañar tus momentos favoritos y crear espacios acogedores.</p>

        </div>

        <div
          id="productosVelas"
          class="productos"

          aria-live="polite">

          {productos.map(producto => {
            if (producto.tipo !== 'velas') return null

            return (
              <div key={producto.id} class="producto">

                <div class="producto-imagen vela-${producto.nombre.toLowerCase().replace(/ /g, '-')}">

                  <img
                    src={`/images/${producto.imagen}`}
                    alt={producto.nombre} />

                </div>

                <div class="producto-info">

                  <span class="categoria">${producto.tipo}</span>

                  <h3>{producto.nombre}</h3>

                  <p>{producto.descripcion}</p>

                  <div class="producto-abajo">

                    <strong>${producto.precio}</strong>

                    <button>
                      Agregar 🛒
                    </button>

                  </div>

                </div>

              </div>
            )
          })}

        </div>
      </section>
    </main>
  )
}

export default Catalogo