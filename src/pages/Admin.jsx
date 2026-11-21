import React, { useState, useEffect } from 'react'

function Admin() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [mensaje, setMensaje] = useState('')

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    tipo: '',
    categoria: '',
    precio: '',
    stock: '',
    imagen: '',
    descripcion: ''
  })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetch('/admin/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar productos')
        return res.json()
      })
      .then(data => {
        setProductos(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setMensaje('Error al cargar productos: ' + err.message)
        setLoading(false)
      })
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditClick = producto => {
    setFormData({
      id: producto.id,
      nombre: producto.nombre,
      tipo: producto.tipo,
      categoria: producto.categoria || '',
      precio: producto.precio,
      stock: producto.stock,
      imagen: producto.imagen,
      descripcion: producto.descripcion || ''
    })
    setIsEditing(true)
  }

  const handleDelete = async id => {
    if (!confirm('¿Seguro que quieres borrar este producto?')) return

    try {
      const res = await fetch(`/admin/api/productos/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setMensaje('Producto borrado correctamente')
        cargarProductos()
      } else {
        const err = await res.json()
        setMensaje(err.error || 'Error al borrar')
      }
    } catch (err) {
      setMensaje('Error de conexión: ' + err.message)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (isEditing) {
      const id = formData.id
      try {
        const res = await fetch(`/admin/api/productos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.nombre,
            tipo: formData.tipo,
            categoria: formData.categoria,
            precio: Number(formData.precio),
            stock: Number(formData.stock) || 0,
            imagen: formData.imagen,
            descripcion: formData.descripcion
          })
        })

        if (res.ok) {
          setMensaje('Producto actualizado correctamente')
          cargarProductos()
          limpiarFormulario()
        } else {
          const err = await res.json()
          setMensaje(err.error || 'Error al actualizar')
        }
      } catch (err) {
        setMensaje('Error de conexión: ' + err.message)
      }
    } else {
      try {
        const res = await fetch('/admin/api/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.nombre,
            tipo: formData.tipo,
            categoria: formData.categoria,
            precio: Number(formData.precio),
            stock: Number(formData.stock) || 0,
            imagen: formData.imagen,
            descripcion: formData.descripcion
          })
        })

        if (res.ok) {
          setMensaje('Producto agregado correctamente')
          cargarProductos()
          limpiarFormulario()
        } else {
          const err = await res.json()
          setMensaje(err.error || 'Error al guardar')
        }
      } catch (err) {
        setMensaje('Error de conexión: ' + err.message)
      }
    }
  }

  const cargarProductos = async () => {
    try {
      const res = await fetch('/admin/api/productos')
      if (!res.ok) throw new Error('Error al cargar productos')
      const data = await res.json()
      setProductos(data)
    } catch (err) {
      console.error(err)
      setMensaje('Error al recargar productos')
    }
  }

  const limpiarFormulario = () => {
    setFormData({
      id: '',
      nombre: '',
      tipo: '',
      categoria: '',
      precio: '',
      stock: '',
      imagen: '',
      descripcion: ''
    })
    setIsEditing(false)
  }

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
      <div class="caja">
        <h2 id="titulo-form">Agregar producto</h2>
        <div id="mensaje">{mensaje}</div>

        <form id="form-producto" onsubmit={handleSubmit}>
          <input type="hidden" id="id" name="id" value={formData.id} />

          <label>Nombre
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange} />
          </label>

          <label>Tipo de producto
            <select id="tipo" name="tipo" required value={formData.tipo} onChange={handleChange}>
              <option value="">Seleccionar tipo</option>
              <option value="libros">Libro</option>
              <option value="velas">Vela</option>
            </select>
          </label>

          <label>Categoría
            <input
              type="text"
              id="categoria"
              name="categoria"
              placeholder="Libros, Café, Velas..."
              value={formData.categoria}
              onChange={handleChange} />
          </label>

          <label>Precio
            <input
              type="number"
              id="precio"
              name="precio"
              min="0"
              step="0.01"
              required
              value={formData.precio}
              onChange={handleChange} />
          </label>

          <label>
            Stock (si es 0 el producto no se ve en la página)
            <input
              type="number"
              id="stock"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange} />
          </label>

          <label>Imagen (ruta dentro de public)
            <input
              type="text"
              id="imagen"
              name="imagen"
              placeholder="imagenes/cafe.jpg"
              value={formData.imagen}
              onChange={handleChange} />
          </label>

          <label>Descripción
            <textarea
              id="descripcion"
              name="descripcion"
              rows="3"
              value={formData.descripcion}
              onChange={handleChange}>
            </textarea>
          </label>

          <button type="submit" class="guardar">
            {isEditing ? 'Actualizar' : 'Guardar'}
          </button>

          <button type="button" class="editar" id="btn-cancelar" style={{ display: isEditing ? 'inline-block' : 'none' }} onClick={limpiarFormulario}>
            Cancelar edición
          </button>
        </form>
      </div>

      <div class="caja">
        <h2>Productos</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.categoria || '-'}</td>
                <td>${producto.precio}</td>
                <td>{producto.stock}</td>
                <td>
                  <button class="editar" onClick={() => handleEditClick(producto)}>
                    Editar
                  </button>
                  <button class="borrar" onClick={() => handleDelete(producto.id)}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Admin