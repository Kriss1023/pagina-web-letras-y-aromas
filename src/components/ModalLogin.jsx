import React from 'react'

function ModalLogin() {
  return (
    <div
      id="modalLogin"
      class="ventana"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tituloLogin">

      <div class="ventana-contenido">

          <button
              type="button"
              class="cerrar"
              onclick="cerrarLogin()"
              aria-label="Cerrar ventana">

              &times;

          </button>

          <h2 id="tituloLogin">
              Iniciar sesión
          </h2>

          <p>
              Acceso de demostración.
              No utilices contraseñas reales.
          </p>

          <form onsubmit="iniciarSesion(event)">

              <label htmlFor="loginEmail">
                  Correo electrónico
              </label>

              <input
                  type="email"
                  id="loginEmail"
                  placeholder="Tu correo electrónico"
                  autocomplete="email"
                  required />

              <label htmlFor="loginPassword">
                  Contraseña
              </label>

              <input
                  type="password"
                  id="loginPassword"
                  placeholder="Tu contraseña"
                  autocomplete="current-password"
                  required />

              <button type="submit" class="boton-cuenta">
                  Iniciar sesión
              </button>

          </form>

          <p class="cambiar-formulario">

              ¿No tienes una cuenta?

              <button
                  type="button"
                  onclick="abrirRegistro()">

                  Regístrate

              </button>

          </p>

      </div>

  </div>
  )
}

export default ModalLogin