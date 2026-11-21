import React, { useState } from 'react'
import { useProductos } from '../hooks/useProductos'

function NosotrosPage() {
  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [mostrarRegistro, setMostrarRegistro] = useState(false)
  const [mostrarCarrito, setMostrarCarrito] = useState(false)
  const [carrito, setCarrito] = useState([])
  const [productos, setProductos] = useState([])
  const { loading } = useProductos()

  useEffect(() => {
    fetch('/api/productos')
      .then((res) => res.json())
      .then(setProductos)
      .finally(() => setLoading(false))
  }, [])

  const total = carrito.reduce((s, p) => s + p.precio, 0)

  return (
    <main>
      <section style={{ padding: '85px 20px 65px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              marginBottom: 20,
              padding: '7px 17px',
              background: '#f4d3df',
              color: '#70495f',
              borderRadius: 30,
              display: 'inline-block',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          >
            Historia y Tradición
          </div>

          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(45px, 6vw, 70px)',
              fontWeight: 700,
              color: '#70495f',
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Somos Letras & Aromas
          </h1>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.9,
              color: '#817580',
              maxWidth: 650,
              margin: '0 auto',
            }}
          >
            Una tienda especializada en libros que cuentan historias y velas artesanales que
            llenan tu hogar de fragancias únicas y significativas.
          </p>
        </div>
      </section>

      <section style={{ margin: '20px auto 100px', maxWidth: 1200, textAlign: 'center' }}>
        <button
          onClick={() => setMostrarLogin(true)}
          style={{
            minHeight: 47,
            padding: '12px 25px',
            background: '#70495f',
            color: '#fff',
            border: '1px solid #70495f',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
            ':hover': {
              background: '#563447',
              color: '#fff',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Iniciar sesión
        </button>

        <button
          onClick={() => setMostrarRegistro(true)}
          style={{
            minHeight: 47,
            padding: '12px 25px',
            background: 'transparent',
            color: '#70495f',
            border: '1px solid rgba(112, 73, 95, 0.35)',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            marginLeft: 15,
            transition: 'background 0.2s ease, color 0.2s ease',
            ':hover': {
              background: '#f4d3df',
              color: '#70495f',
            },
          }}
        >
          Regístrate
        </button>
      </section>
    </main>
  )
}

export default NosotrosPage