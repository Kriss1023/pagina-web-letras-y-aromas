import React from 'react'

function ModalCarrito() {
  return (
    <div
      id="modalCarrito"
      class="ventana"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tituloCarrito">

      <div class="ventana-contenido carrito">

          <button
              type="button"
              class="cerrar"
              onclick="cerrarCarrito()"
              aria-label="Cerrar carrito">

              &times;

          </button>

          <h2 id="tituloCarrito">
              Mi carrito
          </h2>

          <div id="listaCarrito">

              <p>Tu carrito está vacío.</p>

          </div>

          <div class="total">

              <span>Total:</span>

              <strong id="totalCarrito">
                  $0.00
              </strong>

          </div>

          <button
              type="button"
              class="boton-cuenta"
              onclick="comprar()">

              Continuar con el pedido

          </button>

      </div>

  </div>
  )
}

export default ModalCarrito