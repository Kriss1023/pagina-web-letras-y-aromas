import React from 'react'

function ModalRegistro() {
  return (
    <div
      id="modalRegistro"
      class="ventana"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tituloRegistro">

      <div class="ventana-contenido">

          <button
              type="button"
              class="cerrar"
              onclick="cerrarRegistro()"
              aria-label="Cerrar ventana">

              &times;

          </button>

          <h2 id="tituloRegistro">
              Crear cuenta
          </h2>

          <p>
              Registro de demostración.
              No utilices contraseñas reales.
          </p>

          <form onsubmit="registrarse(event)">

              <label htmlFor="registroNombre">
                  Nombre
              </label>

              <input
                  type="text"
                  id="registroNombre"
                  placeholder="Tu nombre"
                  autocomplete="name"
                  required />

              <label htmlFor="registroEmail">
                  Correo electrónico
              </label>

              <input
                  type="email"
                  id="registroEmail"
                  placeholder="Tu correo electrónico"
                  autocomplete="email"
                  required />

              <label htmlFor="registroPassword">
                  Contraseña
              </label>

              <input
                  type="password"
                  id="registroPassword"
                  placeholder="Tu contraseña"
                  autocomplete="new-password"
                  required />

              <button type="submit" class="boton-cuenta">
                  Crear cuenta
              </button>

          </form>

          <p class="cambiar-formulario">

              ¿Ya tienes una cuenta?

              <button
                  type="button"
                  onclick="abrirLogin()">

                  Iniciar sesión

              </button>

          </p>

      </div>

  </div>
  )
}

export default ModalRegistro