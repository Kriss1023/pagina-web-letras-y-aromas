import React, { useState } from 'react'

function AdminPage() {
  const [mensaje, setMensaje] = useState('')

  return (
    <main>
      <h1>Panel de Administración - React + Vite</h1>
      <p>{mensaje}</p>
      <p>Panel admin - migrado desde la versión original Node/Express.</p>
    </main>
  )
}

export default AdminPage