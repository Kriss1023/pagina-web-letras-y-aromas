import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useProductos } from '../hooks/useProductos'

function Home() {
  const { productos, loading } = useProductos()
  const [carrito, setCarrito] = useState([])
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    if (productos.length === 0 && !loading) {
      console.log('Productos vacíos o error de carga')
    }
  }, [productos, loading])

  if (loading) {
    return (
      <main>
        <h1 style={{ textAlign: 'center', color: '#70495f', padding: '50px 0' }}>
          Cargando productos...
        </h1>
      </main>
    )
  }

  const dinero = cantidad => "$" + Number(cantidad).toFixed(2)

  const agregarAlCarrito = producto => {
    const existente = carrito.find((item) => item.id === producto.id)

    if (existente) {
      setCarrito(
        carrito.map(item =>
          item.id === producto.id ? { ...item, stock: item.stock - 1 } : item
        )
      )
    } else {
      setCarrito([...carrito, { ...producto, stock: producto.stock }])
    }

    setMensaje(producto.nombre + ' agregado al carrito')
  }

  const total = carrito.reduce((suma, item) => suma + Number(item.precio), 0)

  const getProductoClass = producto => {
    if (producto.tipo === 'vela') {
      const nombreLower = producto.nombre.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')
      return `ve-la lavanda vela-vainilla vela-rosas vela-chocolate vela-lavanda`.includes(nombreLower) ? `ve-${nombreLower}` : 've-default'
    }
    return 'libro1'
  }

  return (
    <main>
      <section id="inicio" class="inicio">

        <div class="inicio-texto">

          <span class="etiqueta">Bienvenidos</span>

          <h1>
            Un buen libro,
            <br />
            una vela,
            <br />
            <span>un momento especial.</span>
          </h1>

          <p>
            Descubre libros que despiertan emociones
            y velas que crean ambientes llenos de magia.
          </p>

          <div class="botones">

            <a href="/catálogo?tipo=libros" class="boton">
              Ver libros
            </a>

            <a href="/catálogo?tipo=velas" class="boton boton-secundario">
              Ver velas
            </a>

          </div>

        </div>

        <div class="inicio-logo">

          <div class="circulo">

            <img
              src="/images/LOGO.jpeg"
              alt="Letras & Aromas" />

          </div>

        </div>

      </section>

      <section class="beneficios" aria-label="Beneficios de nuestra tienda">

        <div class="beneficio">

          <div class="beneficio-icono">

            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true">

              <path d="M10 17h4V5H2v12h3" />
              <path d="M14 9h4l4 4v4h-3" />
              <circle cx="7.5" cy="17.5" r="2.5" />
              <circle cx="16.5" cy="17.5" r="2.5" />

            </svg>

          </div>

          <h3>Envíos</h3>

          <p>
            Recibe tus productos en la
            comodidad de tu hogar.
          </p>

        </div>

        {productos.map(producto => {
          const imgPath = `/images/${producto.imagen}`
          const claseImagen = producto.tipo === 'vela' ? `ve-${producto.nombre.toLowerCase().replace(/ /g, '-')}` : 'libro1'

          return (
            <div key={producto.id} class="beneficio">

              <div class="producto-imagen ${claseImagen}">

                <img src={imgPath} alt={producto.nombre} />

              </div>

              <div class="producto-info">

                <span class="categoria">${producto.tipo || ''}</span>

                <h3>{producto.nombre}</h3>

                <p>{producto.descripcion}</p>

                <div class="producto-abajo">

                  <strong>${producto.precio}</strong>

                  <button onclick="agregarAlCarrito({ id: ${producto.id}, nombre: '${producto.nombre}', precio: ${producto.precio}, stock: ${producto.stock}, imagen: '${producto.imagen}', descripcion: '${producto.descripcion}' })">
                    Agregar 🛒
                  </button>

                </div>

              </div>

            </div>
          )
        })}

      </section>

      <section id="novedades" class="productos-seccion novedades">

        <div class="titulo">

          <span>Recién llegados</span>

          <h2>Novedades</h2>

          <p>
            Historias por descubrir y aromas
            para acompañar tus momentos.
          </p>

        </div>

        <div class="productos">

          {productos.map(producto => {
            const esVela = producto.tipo === 'vela'
            const esLibro = producto.tipo === 'libro'

            if (esVela || esLibro) {
              return (
                <article key={producto.id} class="producto">

                  <div class="producto-imagen {

                    esVela ? `ve-${producto.nombre.toLowerCase().replace(/ /g, '-')}` : 'libro1'

                  }">

                    <img src={`/images/${producto.imagen}`} alt={producto.nombre} />

                  </div>

                  <div class="producto-info">

                    <span class="categoria">${producto.tipo}</span>

                    <h3>{producto.nombre}</h3>

                    <p>{producto.descripcion}</p>

                    <div class="producto-abajo">

                      <strong>${producto.precio}</strong>

                      <button onclick="agregarAlCarrito({ id: ${producto.id}, nombre: '${producto.nombre}', precio: ${producto.precio}, stock: ${producto.stock}, imagen: '${producto.imagen}', descripcion: '${producto.descripcion}' })">
                        Agregar 🛒
                      </button>

                    </div>

                  </div>

                </article>
              )
            }

            return null
          })}

        </div>

      </section>

      <section id="nosotros" class="nosotros nosotros-inicio">

        <div class="nosotros-imagen">

          <img src="/images/letras y aromas.jpg" alt="fusion de contenidos" />

        </div>

        <div class="nosotros-texto">

          <span class="etiqueta">Conócenos</span>

          <h2>Nosotros</h2>

          <h3 class="nosotros-frase">
            Letras que cuentan historias,
            aromas que crean recuerdos.
          </h3>

          <p>
            En Letras & Aromas creemos que los
            pequeños momentos pueden convertirse
            en recuerdos inolvidables.
          </p>

        </div>

      </section>

      <Footer />
    </main>
  )
}

export default Home