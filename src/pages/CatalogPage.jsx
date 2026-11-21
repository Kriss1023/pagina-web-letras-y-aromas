import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProductos } from '../hooks/useProductos'
import ProductList from '../components/ProductList'
import Filters from '../components/Filters'

function CatalogPage() {
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

  const tipos = [
    { label: 'Todos', valor: null },
    { label: 'Libros', valor: 'libros' },
    { label: 'Velas', valor: 'velas' },
  ]

  return (
    <main>
      <section style={{ padding: '70px 0 75px' }}>
        <Filters onFilterChange={setTipoFiltrado} />

        <ProductList productos={productos} tipo={tipoFiltrado} />
      </section>
    </main>
  )
}

export default CatalogPage