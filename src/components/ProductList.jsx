import React from 'react'
import ProductCard from './ProductCard'

function ProductList({ productos, tipo = null }) {
  const productosFiltrados = tipo
    ? productos.filter((p) => p.tipo === tipo)
    : productos

  const gridCols = typeof window !== 'undefined' ? window.innerWidth < 650 ? 1 : window.innerWidth < 1000 ? 2 : 3 : 3

  return (
    <div
      className="productos"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        alignItems: 'stretch',
        gap: gridCols === 3 ? '28px' : gridCols === 2 ? '20px' : '13px',
      }}
    >
      {productosFiltrados.length === 0 && (
        <p
          style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            color: '#817580',
            padding: '35px 20px',
            fontSize: '14px',
          }}
        >
          No hay productos con este filtro
        </p>
      )}

      {productosFiltrados.length > 0 && productosFiltrados.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}

      {!productosFiltrados.length && productos.length > 0 && (
        <p
          style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            color: '#817580',
            padding: '35px 20px',
            fontSize: '14px',
          }}
        >
          No hay productos disponibles
        </p>
      )}
    </div>
  )
}

export default ProductList