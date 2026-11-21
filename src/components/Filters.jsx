import React from 'react'

function Filters({ onFilterChange }) {
  const tipos = [
    { label: 'Todos', valor: 'todos' },
    { label: 'Libros', valor: 'libros' },
    { label: 'Velas', valor: 'velas' },
  ]

  const handleTipoChange = (e) => {
    const tipo = e.target.value
    onFilterChange(tipo === 'todos' ? null : tipo)
  }

  return (
    <div
      className="catalogo-filtros"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        margin: '35px auto 15px',
      }}
    >
      {tipos.map((opcion) => (
        <button
          key={opcion.valor}
          className="filtro"
          style={{
            minWidth: '115px',
            minHeight: '44px',
            padding: '11px 23px',
            background: 'white',
            color: '#70495f',
            border: '1px solid rgba(112, 73, 95, 0.3)',
            borderRadius: '25px',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s ease, color 0.2s ease, borderColor 0.2s ease, transform 0.2s ease',
            ...(typeof window !== 'undefined' && {
              ':hover': {
                background: '#f4d3df',
                borderColor: 'rgba(112, 73, 95, 0.3)',
                transform: 'translateY(-2px)',
              },
            }),
            ...(opcion.valor !== 'todos' && window.location.hash.replace('#', '') === opcion.valor ? {
              background: '#70495f',
              color: '#fff',
              borderColor: '#70495f',
            } : {}),
            ...(opcion.valor !== 'todos' && window.location.hash.replace('#', '') === opcion.valor ? {
              ':hover': {
                background: '#563447',
              },
            } : {}),
          }}
          onClick={handleTipoChange}
        >
          {opcion.label}
        </button>
      ))}
    </div>
  )
}

export default Filters