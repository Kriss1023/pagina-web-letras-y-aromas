import React, { useEffect, useState } from 'react'
import { useProductos } from '../hooks/useProductos'
import ProductList from '../components/ProductList'
import ProductCard from '../components/ProductCard'
import Filters from '../components/Filters'

function HomePage() {
  const { productos, loading } = useProductos()

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

  const productosDestacados = productos.filter((p) => p.tipo === 'libros' || p.tipo === 'velas')
    .slice(0, 4)

  return (
    <main>
      <section id="inicio" class="inicio">
        <div className="inicio-texto">
          <span className="etiqueta">Bienvenidos</span>

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

          <div className="botones">
            <a href="/catálogo?tipo=libros" className="boton">
              Ver libros
            </a>
            <a href="/catálogo?tipo=velas" className="boton boton-secundario">
              Ver velas
            </a>
          </div>
        </div>

        <div className="inicio-logo">
          <div className="circulo">
            <img src="/images/LOGO.jpeg" alt="Letras & Aromas" />
          </div>
        </div>
      </section>

      <section className="beneficios" aria-label="Beneficios de nuestra tienda">
        <div className="beneficio">
          <div className="beneficio-icono">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <path d="M10 17h4V5H2v12h3" />
              <path d="M14 9h4l4 4v4h-3" />
              <circle cx="7.5" cy="17.5" r="2.5" />
              <circle cx="16.5" cy="17.5" r="2.5" />
            </svg>
          </div>

          <h3>Envíos</h3>

          <p>Recibe tus productos en la comodidad de tu hogar.</p>
        </div>

        <div className="beneficio">
          <div className="producto-imagen libro1">
            <img src="images/amor entre paginas.jfif" alt="portada del libro" />
          </div>

          <div className="producto-info">
            <span className="categoria">NOVELA</span>

            <h3>Entre páginas</h3>

            <p>
              Una historia llena de emociones,
              encuentros y nuevos comienzos.
            </p>

            <div className="producto-abajo">
              <strong>$18.00</strong>

              <button onclick="agregarCarrito('Entre páginas', 18)">
                Agregar 🛒
              </button>
            </div>
          </div>
        </div>

        <div className="beneficio">
          <div className="producto-imagen libro2">
            <img src="images/cartas de otono.jfif" alt="portada del libro" />
          </div>

          <div className="producto-info">
            <span className="categoria">ROMANCE</span>

            <h3>Cartas de otoño</h3>

            <p>
              Una historia romántica para leer
              acompañada de una taza de café.
            </p>

            <div className="producto-abajo">
              <strong>$20.00</strong>

              <button onclick="agregarCarrito('Cartas de otoño', 20)">
                Agregar 🛒
              </button>
            </div>
          </div>
        </div>

        <div className="beneficio">
          <div className="producto-imagen libro3">
            <img src="images/-el-jardin-secreto.jpg" alt="portada del libro" />
          </div>

          <div className="producto-info">
            <span className="categoria">FANTASÍA</span>

            <h3>El jardín secreto</h3>

            <p>
              Una aventura mágica donde
              todo puede hacerse realidad.
            </p>

            <div className="producto-abajo">
              <strong>$22.00</strong>

              <button onclick="agregarCarrito('El jardín secreto',22)">
                Agregar 🛒
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="novedades" className="productos-seccion novedades">
        <div className="titulo">
          <span>Recién llegados</span>

          <h2>Novedades</h2>

          <p>
            Historias por descubrir y aromas
            para acompañar tus momentos.
          </p>
        </div>

        <div className="productos">
          <article className="producto">
            <div className="producto-imagen vela-lavanda">
              <img src="/images/vela-lavanda.jfif" alt="vela lavanda" />
            </div>

            <div className="producto-info">
              <span className="categoria">RELAX</span>

              <h3>Lavanda</h3>

              <p>
                Aroma floral y relajante para
                crear un espacio tranquilo.
              </p>

              <div className="producto-abajo">
                <strong>$12.00</strong>

                <button onclick="agregarCarrito('Vela de Lavanda', 12)">
                  Agregar 🛒
                </button>
              </div>
            </div>
          </article>

          <article className="producto">
            <div className="producto-imagen vela-vainilla">
              <img src="/images/vela-vainilla.jfif" alt="vela vainilla" />
            </div>

            <div className="producto-info">
              <span className="categoria">DULCE</span>

              <h3>Vainilla</h3>

              <p>
                Un aroma cálido, dulce y acogedor.
              </p>

              <div className="producto-abajo">
                <strong>$13.00</strong>

                <button onclick="agregarCarrito('Vela de Vainilla', 13)">
                  Agregar 🛒
                </button>
              </div>
            </div>
          </article>

          <article className="producto">
            <div className="producto-imagen libro1">
              <img src="images/orgullo y prejuicio.jpg" alt="portada del libro" />
            </div>

            <div className="producto-info">
              <span className="categoria">NOVELA</span>

              <h3>Orgullo y Prejuicio</h3>

              <p>
                Elizabeth Bennet y Fitzwilliam Darcy,
                y cómo deben superar sus propios defectos
                de carácter para poder estar juntos.
              </p>

              <div className="producto-abajo">
                <strong>$22.00</strong>

                <button onclick="agregarCarrito('Orgullo y prejuicio', 24)">
                  Agregar 🛒
                </button>
              </div>
            </div>
          </article>

          <article className="producto">
            <div className="producto-imagen libro1">
              <img src="images/en agosto nos vemos.webp" alt="portada del libro" />
            </div>

            <div className="producto-info">
              <span className="categoria">NOVELA</span>

              <h3>En Agosto Nos Vemos</h3>

              <p>
                Novela póstuma del escritor colombiano
                Gabriel García Márquez, publicada en
                marzo de 2024.
              </p>

              <div className="producto-abajo">
                <strong>$15.00</strong>

                <button onclick="agregarCarrito('En Agosto Nos Vemos', 26)">
                  Agregar 🛒
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="nosotros" className="nosotros nosotros-inicio">
        <div className="nosotros-imagen">
          <img src="images/letras y aromas.jpg" alt="fusion de contenidos" />
        </div>

        <div className="nosotros-texto">
          <span className="etiqueta">Conócenos</span>

          <h2>Nosotros</h2>

          <h3 className="nosotros-frase">
            Letras que cuentan historias,
            aromas que crean recuerdos.
          </h3>

          <p>
            En Letras & Aromas creemos que los
            pequeños momentos pueden convertirse
            en recuerdos inolvidables.
          </p>

          <p>
            Por eso reunimos libros y velas
            para que puedas crear tu propio
            espacio de tranquilidad,
            imaginación y bienestar.
          </p>

          <a href="/nosotros" className="boton boton-nosotros">
            Conocer más
          </a>
        </div>
      </section>

      </main>
  )
}

export default HomePage