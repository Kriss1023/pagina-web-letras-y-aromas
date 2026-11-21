import React from 'react'

function ProductCard({ producto }) {
  return (
    <div
      className="producto"
      style={{
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#fff',
        border: '1px solid rgba(112, 73, 95, 0.13)',
        borderRadius: '18px',
        boxShadow: '0 5px 20px rgba(67, 42, 59, 0.04)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <div
        className="producto-imagen"
        style={{
          width: '100%',
          height: '255px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '22px',
          background: 'linear-gradient(135deg, #f8e9ee, #f0eaf3)',
          overflow: 'hidden',
        }}
      >
        <img
          src={producto.imagen ? `/images/${producto.imagen}` : '/placeholder.jpg'}
          alt={producto.nombre}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>

      <div className="producto-info" style={{ padding: '23px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span
          className="categoria"
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#aa7890',
          }}
        >
          {producto.tipo || 'TIPO'}
        </span>

        <h3
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '22px',
            lineHeight: '1.25',
            color: '#70495f',
            margin: '9px 0 10px',
            overflowWrap: 'anywhere',
          }}
        >
          {producto.nombre}
        </h3>

        <p
          style={{
            marginBottom: '22px',
            color: '#817580',
            fontSize: '13px',
            lineHeight: '1.65',
            flex: 1,
          }}
        >
          {producto.descripcion || ''}
        </p>
      </div>

      <div
        className="producto-abajo"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: 'auto',
        }}
      >
        <strong
          style={{
            fontSize: '19px',
            fontWeight: '700',
            color: '#70495f',
          }}
        >
          ${producto.precio?.toFixed(2) || '0.00'}
        </strong>

        <button
          style={{
            padding: '9px 13px',
            background: '#f4d3df',
            color: '#70495f',
            border: 'none',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
        >
          Añadir carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard