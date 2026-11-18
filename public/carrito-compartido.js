
/* LETRAS & AROMAS - Carrito compartido */

(() => {
    "use strict";

    const CLAVE = "letrasAromas_carrito_v1";
    const CONSULTA = "letrasAromas_consulta_v1";

    let productos = [];

    // Recuperar el carrito guardado
    function leerCarrito() {
        try {
            const datos = JSON.parse(
                localStorage.getItem(CLAVE) || "[]"
            );

            if (!Array.isArray(datos)) return [];

            return datos.slice(0, 100).filter(p =>
                p &&
                typeof p.nombre === "string" &&
                Number.isFinite(Number(p.precio)) &&
                Number(p.precio) >= 0
            ).map(p => ({
                id: String(
                    p.id || `nombre:${p.nombre.toLowerCase()}`
                ),
                nombre: p.nombre,
                precio: Number(p.precio),
                cantidad: Math.max(
                    1,
                    Math.min(
                        99,
                        Math.floor(Number(p.cantidad) || 1)
                    )
                ),
                stock: Number.isInteger(p.stock) &&
                       p.stock >= 0
                    ? p.stock
                    : null
            }));

        } catch {
            return [];
        }
    }

    productos = leerCarrito();

    function guardar() {
        try {
            localStorage.setItem(
                CLAVE,
                JSON.stringify(productos)
            );
        } catch (error) {
            console.warn(
                "No se pudo conservar el carrito:",
                error
            );
        }

        dibujarCarrito();
    }

    function avisar(texto) {
        if (typeof window.mostrarMensaje === "function") {
            window.mostrarMensaje(texto);
        } else {
            console.info(texto);
        }
    }

    function dinero(numero) {
        return "$" + Number(numero).toFixed(2);
    }

    /* AGREGAR PRODUCTOS */

    function agregarCarritoCompartido(
        valor,
        precio,
        id,
        stock
    ) {
        const p = valor && typeof valor === "object"
            ? valor
            : {
                nombre: valor,
                precio,
                _id: id,
                stock
            };

        const nombre = String(p.nombre || "").trim();
        const costo = Number(p.precio);

        if (
            !nombre ||
            !Number.isFinite(costo) ||
            costo < 0
        ) {
            avisar("No se pudo agregar este producto.");
            return;
        }

        const clave = p._id
            ? String(p._id)
            : `nombre:${nombre.toLowerCase()}`;

        const disponible =
            p.stock == null || p.stock === ""
                ? null
                : Number(p.stock);

        const stockValido =
            Number.isInteger(disponible) &&
            disponible >= 0
                ? disponible
                : null;

        const existente = productos.find(
            item => item.id === clave
        );

        const maximo = Math.min(
            stockValido ?? 99,
            99
        );

        if (
            (existente?.cantidad || 0) >= maximo
        ) {
            avisar("No hay más unidades disponibles.");
            return;
        }

        if (existente) {
            existente.cantidad++;
            existente.precio = costo;
            existente.stock = stockValido;
        } else {
            productos.push({
                id: clave,
                nombre,
                precio: costo,
                cantidad: 1,
                stock: stockValido
            });
        }

        guardar();

        avisar(nombre + " se agregó al carrito.");
    }

    /* MODIFICAR CANTIDADES */

    function modificarCantidad(indice, cambio) {
        const p = productos[indice];

        if (!p) return;

        const nueva = p.cantidad + cambio;

        if (nueva <= 0) {
            productos.splice(indice, 1);

        } else if (
            nueva > Math.min(p.stock ?? 99, 99)
        ) {
            avisar("No hay más unidades disponibles.");
            return;

        } else {
            p.cantidad = nueva;
        }

        guardar();
    }

    function eliminarProducto(indice) {
        productos.splice(indice, 1);
        guardar();
    }

    /* MOSTRAR CARRITO */

    function dibujarCarrito() {
        const contador =
            document.getElementById("contador");

        const lista =
            document.getElementById("listaCarrito");

        const total =
            document.getElementById("totalCarrito");

        if (contador) {
            contador.textContent = productos.reduce(
                (suma, p) => suma + p.cantidad,
                0
            );
        }

        if (!lista || !total) return;

        lista.replaceChildren();

        if (productos.length === 0) {
            const vacio = document.createElement("p");

            vacio.textContent = "Tu carrito está vacío.";

            lista.appendChild(vacio);
        }

        productos.forEach((p, indice) => {
            const fila = document.createElement("div");
            fila.className = "item-carrito";

            const info = document.createElement("div");

            const nombre = document.createElement("strong");
            nombre.textContent = p.nombre;

            const precio = document.createElement("small");
            precio.textContent = dinero(
                p.precio * p.cantidad
            );

            info.append(nombre, precio);

            // Controles de cantidad
            const controles = document.createElement("div");
            controles.className = "controles-cantidad";

            const menos = document.createElement("button");
            menos.type = "button";
            menos.textContent = "−";
            menos.setAttribute(
                "aria-label",
                "Restar una unidad de " + p.nombre
            );

            menos.addEventListener("click", () => {
                modificarCantidad(indice, -1);
            });

            const cantidad = document.createElement("span");
            cantidad.textContent = p.cantidad;

            const mas = document.createElement("button");
            mas.type = "button";
            mas.textContent = "+";
            mas.setAttribute(
                "aria-label",
                "Agregar una unidad de " + p.nombre
            );

            mas.addEventListener("click", () => {
                modificarCantidad(indice, 1);
            });

            controles.append(
                menos,
                cantidad,
                mas
            );

            // Eliminar producto
            const quitar = document.createElement("button");

            quitar.type = "button";
            quitar.className = "quitar-carrito";
            quitar.textContent = "Quitar";

            quitar.addEventListener("click", () => {
                eliminarProducto(indice);
            });

            fila.append(
                info,
                controles,
                quitar
            );

            lista.appendChild(fila);
        });

        const suma = productos.reduce(
            (total, p) =>
                total + p.precio * p.cantidad,
            0
        );

        total.textContent = dinero(suma);
    }

    /* ABRIR Y CERRAR */

    function abrirCarrito() {
        const modal =
            document.getElementById("modalCarrito");

        if (!modal) return;

        dibujarCarrito();

        modal.hidden = false;
        modal.classList.add("activa");
    }

    function cerrarCarrito() {
        const modal =
            document.getElementById("modalCarrito");

        if (!modal) return;

        modal.classList.remove("activa");
        modal.hidden = true;
        modal.style.display = "";
    }

    /* CONSULTA DE PEDIDO */

    function textoConsulta() {
        const detalle = productos.map(p =>
            `${p.cantidad} × ${p.nombre} — ${dinero(
                p.precio * p.cantidad
            )}`
        ).join("\n");

        const total = productos.reduce(
            (suma, p) =>
                suma + p.precio * p.cantidad,
            0
        );

        return (
            "Hola, quisiera consultar la disponibilidad " +
            "de estos productos:\n\n" +
            detalle +
            "\n\nTotal estimado: " +
            dinero(total) +
            "\nAgradezco información sobre las opciones " +
            "de entrega."
        );
    }

    function rellenarContacto(texto) {
        const asunto =
            document.getElementById("asuntoContacto");

        const mensaje =
            document.getElementById("mensajeContacto");

        if (!asunto || !mensaje) return false;

        if (!asunto.value.trim()) {
            asunto.value =
                "Consulta de productos del carrito";
        }

        mensaje.value = mensaje.value.trim()
            ? mensaje.value + "\n\n" + texto
            : texto;

        cerrarCarrito();

        document.getElementById("contacto")
            ?.scrollIntoView({
                behavior: "smooth"
            });

        mensaje.focus({
            preventScroll: true
        });

        return true;
    }

    function consultarPedido() {
        if (productos.length === 0) {
            avisar(
                "Agrega productos al carrito " +
                "para realizar una consulta."
            );
            return;
        }

        const texto = textoConsulta();

        // Si estamos en Nosotros, llenar el formulario.
        if (rellenarContacto(texto)) return;

        // Si estamos en Inicio o Catálogo, ir a Nosotros.
        try {
            sessionStorage.setItem(
                CONSULTA,
                texto
            );

            window.location.assign(
                "nosotros.html#contacto"
            );

        } catch (error) {
            console.error(
                "No se pudo preparar la consulta:",
                error
            );

            avisar(
                "No se pudo preparar la consulta."
            );
        }
    }

    /* BOTÓN DE CONSULTA */

    function prepararBoton() {
        const caja = document.querySelector(
            "#modalCarrito .ventana-contenido.carrito"
        );

        if (!caja) return;

        let boton = caja.querySelector(
            "button.boton-cuenta"
        );

        if (!boton) {
            boton = document.createElement("button");

            boton.type = "button";
            boton.className = "boton-cuenta";

            caja.appendChild(boton);
        }

        boton.textContent = "Consultar pedido";
        boton.onclick = consultarPedido;

        if (!caja.querySelector(".aviso-carrito")) {
            const aviso = document.createElement("p");

            aviso.className = "aviso-carrito";

            aviso.textContent =
                "Se enviará una consulta, no un pago " +
                "ni una compra confirmada.";

            caja.appendChild(aviso);
        }
    }

    /* COMPATIBILIDAD CON LAS TRES PÁGINAS */

    window.agregarCarrito = agregarCarritoCompartido;
    window.actualizarCarrito = dibujarCarrito;
    window.eliminarProducto = eliminarProducto;

    window.mostrarCarrito = abrirCarrito;
    window.abrirCarrito = abrirCarrito;
    window.cerrarCarrito = cerrarCarrito;

    window.comprar = consultarPedido;

    function iniciar() {
        prepararBoton();
        dibujarCarrito();

        // Recuperar consulta al entrar en Nosotros.
        const pendiente = sessionStorage.getItem(
            CONSULTA
        );

        if (
            pendiente &&
            rellenarContacto(pendiente)
        ) {
            sessionStorage.removeItem(CONSULTA);
        }
    }

    // Sincronizar si hay otra pestaña abierta.
    window.addEventListener("storage", event => {
        if (event.key === CLAVE) {
            productos = leerCarrito();
            dibujarCarrito();
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciar
        );
    } else {
        iniciar();
    }

})();
