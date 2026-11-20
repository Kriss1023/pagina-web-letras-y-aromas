
/* ==========================================
   LETRAS & AROMAS - SCRIPT DE INICIO
   Productos, carrito y ventanas
========================================== */

let carrito = [];
let productosServidor = [];
let cuentaTemporal = null;
let temporizadorMensaje = null;

function formatoPrecio(valor) {
    return "$" + Number(valor).toFixed(2);
}

function normalizarTexto(valor) {
    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function rutaImagen(nombre) {
    let ruta = String(nombre || "")
        .trim()
        .replace(/\\/g, "/");

    if (!ruta) return "";

    if (/^https:\/\//i.test(ruta)) {
        return ruta;
    }

    if (/^[a-z]+:\/\//i.test(ruta)) {
        return "";
    }

    ruta = ruta
        .replace(/^\/?public\//i, "")
        .replace(/^\/+/, "");

    if (ruta.includes("..")) {
        return "";
    }

    if (
        ruta.toLowerCase().startsWith(
            "images/"
        )
    ) {
        return ruta;
    }

    return "images/" + ruta;
}

/* ==========================================
   NOVEDADES - DOS LIBROS Y DOS VELAS
========================================== */

function seleccionarNovedades(productos) {
    const seleccion = [
        {
            tipo: "libros",
            nombre: "Mi planta de Naranja-Lima",
            clave: "naranja lima",
            clase: "libro1"
        },
        {
            tipo: "libros",
            nombre: "La Odisea",
            clave: "odisea",
            clase: "libro2"
        },
        {
            tipo: "velas",
            nombre: "Vela de limón",
            clave: "limon",
            clase: "vela-vainilla"
        },
        {
            tipo: "velas",
            nombre: "Vela de chocolate",
            clave: "chocolate",
            clase: "vela-chocolate"
        }
    ];

    return seleccion.map(item => {
        const producto = productos.find(p => {
            const tipo = normalizarTexto(p.tipo);
            const nombre = normalizarTexto(p.nombre);

            if (tipo !== item.tipo) {
                return false;
            }

            if (item.clave === "naranja lima") {
                return nombre.includes("naranja") &&
                       nombre.includes("lima");
            }

            return nombre.includes(item.clave);
        });

        return {
            ...item,
            producto
        };
    });
}

async function cargarProductos() {
    const contenedor =
        document.getElementById("productosNuevos");

    if (!contenedor) return;

    try {
        const respuesta = await fetch("/api/productos");

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo consultar MongoDB"
            );
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error(
                "Respuesta de productos incorrecta"
            );
        }

        const elegidos = seleccionarNovedades(datos);

        productosServidor = elegidos
            .filter(item => item.producto)
            .map(item => item.producto);

        contenedor.replaceChildren();

        for (const item of elegidos) {
            if (!item.producto) {
                continue;
            }

            const producto = item.producto;

            const tarjeta =
                document.createElement("article");

            tarjeta.className = "producto";

            /* Imagen del producto */

            const areaImagen =
                document.createElement("div");

            areaImagen.className =
                "producto-imagen " + item.clase;

            function mostrarSinImagen() {
                areaImagen.replaceChildren();

                const aviso =
                    document.createElement("span");

                aviso.textContent =
                    "Imagen no disponible";

                aviso.style.fontSize = "13px";

                areaImagen.appendChild(aviso);
            }

            const origen = rutaImagen(producto.imagen);

            if (origen) {
                const imagen =
                    document.createElement("img");

                imagen.src = origen;
                imagen.alt = producto.nombre;
                imagen.loading = "lazy";

                imagen.addEventListener(
                    "error",
                    mostrarSinImagen
                );

                areaImagen.appendChild(imagen);
            } else {
                mostrarSinImagen();
            }

            /* Información del producto */

            const info =
                document.createElement("div");

            info.className = "producto-info";

            const categoria =
                document.createElement("span");

            categoria.className = "categoria";
            categoria.textContent =
                producto.categoria || item.tipo;

            const titulo =
                document.createElement("h3");

            titulo.textContent =
                producto.nombre || item.nombre;

            const descripcion =
                document.createElement("p");

            descripcion.textContent =
                producto.descripcion || "";

            /* Precio y botón */

            const pie =
                document.createElement("div");

            pie.className = "producto-abajo";

            const precio =
                document.createElement("strong");

            precio.textContent =
                formatoPrecio(producto.precio);

            const boton =
                document.createElement("button");

            boton.type = "button";

            const stock =
                Number(producto.stock || 0);

            const disponible =
                stock > 0 &&
                Number.isFinite(
                    Number(producto.precio)
                );

            boton.textContent = disponible
                ? "Agregar al carrito"
                : "Agotado";

            boton.disabled = !disponible;

            if (disponible) {
                boton.addEventListener(
                    "click",
                    () => agregarDelServidor(producto)
                );
            }

            pie.append(precio, boton);

            info.append(
                categoria,
                titulo,
                descripcion,
                pie
            );

            tarjeta.append(areaImagen, info);

            contenedor.appendChild(tarjeta);
        }

        /* Avisar si falta alguno de los cuatro */

        const faltantes = elegidos
            .filter(item => !item.producto)
            .map(item => item.nombre);

        if (faltantes.length) {
            const aviso =
                document.createElement("p");

            aviso.className = "cargando-productos";

            aviso.textContent =
                "Aún no aparecen en MongoDB: " +
                faltantes.join(", ") + ".";

            contenedor.appendChild(aviso);
        }

    } catch (error) {
        console.error(
            "No se pudieron cargar las novedades:",
            error
        );

        contenedor.replaceChildren();

        const aviso =
            document.createElement("p");

        aviso.className = "cargando-productos";

        aviso.textContent =
            "No se pudieron cargar las novedades. " +
            "Actualiza la página.";

        contenedor.appendChild(aviso);
    }
}

function agregarDelServidor(producto) {
    if (!producto) return;

    agregarCarrito(
        producto.nombre,
        producto.precio,
        producto._id,
        producto.stock
    );
}

/* ==========================================
   CARRITO DE COMPRAS
========================================== */

function agregarCarrito(
    nombre,
    precio,
    id = null,
    stock = null
) {
    const valor = Number(precio);

    if (
        !Number.isFinite(valor) ||
        valor < 0
    ) {
        mostrarMensaje(
            "Este producto no tiene un precio válido."
        );

        return;
    }

    if (
        stock !== null &&
        stock !== undefined
    ) {
        const enCarrito = carrito.filter(
            producto =>
                producto.id === id &&
                id !== null
        ).length;

        if (enCarrito >= Number(stock)) {
            mostrarMensaje(
                "No quedan más unidades disponibles."
            );

            return;
        }
    }

    carrito.push({
        nombre: String(nombre),
        precio: valor,
        id
    });

    actualizarCarrito();

    mostrarMensaje(
        nombre + " se agregó al carrito."
    );
}

function actualizarCarrito() {
    const contador =
        document.getElementById("contador");

    const lista =
        document.getElementById("listaCarrito");

    const total =
        document.getElementById("totalCarrito");

    if (!contador || !lista || !total) {
        return;
    }

    contador.textContent = carrito.length;

    lista.replaceChildren();

    if (carrito.length === 0) {
        const vacio =
            document.createElement("p");

        vacio.textContent =
            "Tu carrito está vacío.";

        lista.appendChild(vacio);
    }

    carrito.forEach((producto, index) => {
        const fila =
            document.createElement("div");

        fila.className = "item-carrito";

        const datos =
            document.createElement("div");

        const nombre =
            document.createElement("strong");

        nombre.textContent = producto.nombre;

        const precio =
            document.createElement("small");

        precio.textContent =
            formatoPrecio(producto.precio);

        datos.append(nombre, precio);

        const eliminar =
            document.createElement("button");

        eliminar.type = "button";
        eliminar.textContent = "×";

        eliminar.setAttribute(
            "aria-label",
            "Eliminar " + producto.nombre
        );

        eliminar.addEventListener(
            "click",
            () => eliminarProducto(index)
        );

        fila.append(datos, eliminar);

        lista.appendChild(fila);
    });

    total.textContent = formatoPrecio(
        carrito.reduce(
            (suma, producto) =>
                suma + producto.precio,
            0
        )
    );
}

function eliminarProducto(index) {
    if (
        index < 0 ||
        index >= carrito.length
    ) {
        return;
    }

    carrito.splice(index, 1);

    actualizarCarrito();

    mostrarMensaje(
        "Producto eliminado del carrito."
    );
}

function mostrarCarrito() {
    document
        .getElementById("modalCarrito")
        ?.classList.add("activa");
}

function cerrarCarrito() {
    document
        .getElementById("modalCarrito")
        ?.classList.remove("activa");
}

/* ==========================================
   SOLICITUD DE PEDIDO POR CORREO
========================================== */

function comprar() {
    if (!carrito.length) {
        mostrarMensaje(
            "Agrega un producto antes de continuar."
        );

        return;
    }

    const detalle = carrito.map(
        producto =>
            "- " +
            producto.nombre +
            ": " +
            formatoPrecio(producto.precio)
    );

    const total = carrito.reduce(
        (suma, producto) =>
            suma + producto.precio,
        0
    );

    const asunto = encodeURIComponent(
        "Consulta de pedido - Letras & Aromas"
    );

    const cuerpo = encodeURIComponent(
        "Hola, quisiera consultar la disponibilidad " +
        "de estos productos:\n\n" +
        detalle.join("\n") +
        "\n\nTotal estimado: " +
        formatoPrecio(total) +
        "\n\nPor favor, confírmenme el precio final " +
        "y las opciones de entrega."
    );

    window.location.href =
        "mailto:aromasletras@gmail.com" +
        "?subject=" + asunto +
        "&body=" + cuerpo;

    mostrarMensaje(
        "Se abrirá tu correo para consultar el pedido. " +
        "Aún no se ha enviado ni cobrado."
    );
}

/* ==========================================
   INICIO DE SESIÓN Y REGISTRO
   FUNCIONES TEMPORALES
========================================== */

function abrirLogin() {
    cerrarRegistro();

    document
        .getElementById("modalLogin")
        ?.classList.add("activa");
}

function cerrarLogin() {
    document
        .getElementById("modalLogin")
        ?.classList.remove("activa");
}

function abrirRegistro() {
    cerrarLogin();

    document
        .getElementById("modalRegistro")
        ?.classList.add("activa");
}

function cerrarRegistro() {
    document
        .getElementById("modalRegistro")
        ?.classList.remove("activa");
}

function registrarse(event) {
    event.preventDefault();

    const nombre = document
        .getElementById("registroNombre")
        ?.value.trim();

    const email = document
        .getElementById("registroEmail")
        ?.value.trim();

    const clave = document
        .getElementById("registroPassword")
        ?.value;

    if (!nombre || !email || !clave) {
        mostrarMensaje(
            "Completa todos los campos."
        );

        return;
    }

    // Cuenta temporal, solo para demostración.
    // Se elimina al recargar la página.
    // No debe utilizarse con datos reales.

    cuentaTemporal = {
        nombre,
        email,
        clave
    };

    document
        .querySelector("#modalRegistro form")
        ?.reset();

    cerrarRegistro();

    mostrarMensaje(
        "Cuenta de prueba creada para esta sesión. " +
        "No uses datos reales."
    );
}

function iniciarSesion(event) {
    event.preventDefault();

    const email = document
        .getElementById("loginEmail")
        ?.value.trim();

    const clave = document
        .getElementById("loginPassword")
        ?.value;

    if (!cuentaTemporal) {
        mostrarMensaje(
            "Crea primero una cuenta de prueba. " +
            "Se borra al actualizar la página."
        );

        return;
    }

    if (
        email === cuentaTemporal.email &&
        clave === cuentaTemporal.clave
    ) {
        cerrarLogin();

        mostrarMensaje(
            "Bienvenido/a, " +
            cuentaTemporal.nombre + "."
        );

    } else {
        mostrarMensaje(
            "Correo o contraseña incorrectos."
        );
    }
}

/* ==========================================
   NEWSLETTER
========================================== */

function suscribirse(event) {
    event.preventDefault();

    mostrarMensaje(
        "La suscripción por correo aún no está habilitada."
    );
}

/* ==========================================
   MENSAJES EMERGENTES
========================================== */

function mostrarMensaje(texto) {
    const caja =
        document.getElementById("mensaje");

    if (!caja) {
        console.info(texto);
        return;
    }

    caja.textContent = texto;
    caja.classList.add("mostrar");

    clearTimeout(temporizadorMensaje);

    temporizadorMensaje = setTimeout(
        () => caja.classList.remove("mostrar"),
        3500
    );
}

/* ==========================================
   CERRAR VENTANAS
========================================== */

window.addEventListener(
    "click",
    event => {
        if (
            event.target ===
            document.getElementById("modalLogin")
        ) {
            cerrarLogin();
        }

        if (
            event.target ===
            document.getElementById("modalRegistro")
        ) {
            cerrarRegistro();
        }

        if (
            event.target ===
            document.getElementById("modalCarrito")
        ) {
            cerrarCarrito();
        }
    }
);

window.addEventListener(
    "keydown",
    event => {
        if (event.key === "Escape") {
            cerrarLogin();
            cerrarRegistro();
            cerrarCarrito();
        }
    }
);

/* ==========================================
   FORMULARIO DE CONTACTO
   PARA LA PÁGINA NOSOTROS
========================================== */

function configurarFormularioContacto() {
    const formulario =
        document.getElementById("formularioContacto");

    if (!formulario) {
        return;
    }

    formulario.addEventListener(
        "submit",
        async event => {
            event.preventDefault();

            const estado =
                document.getElementById(
                    "respuestaContacto"
                );

            const boton = formulario.querySelector(
                'button[type="submit"]'
            );

            const campos = [
                "nombre",
                "email",
                "asunto",
                "mensaje"
            ];

            const ids = [
                "nombreContacto",
                "emailContacto",
                "asuntoContacto",
                "mensajeContacto"
            ];

            const datos = {};

            for (
                let i = 0;
                i < campos.length;
                i++
            ) {
                const campo =
                    document.getElementById(ids[i]);

                if (!campo) {
                    if (estado) {
                        estado.textContent =
                            "Falta un campo del formulario.";
                    }

                    return;
                }

                datos[campos[i]] =
                    campo.value.trim();
            }

            if (boton) {
                boton.disabled = true;
            }

            if (estado) {
                estado.textContent =
                    "Enviando mensaje...";

                estado.style.color = "";
            }

            try {
                const respuesta = await fetch(
                    "/api/contacto",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify(datos)
                    }
                );

                const resultado =
                    await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        resultado.mensaje ||
                        "No se pudo enviar el mensaje"
                    );
                }

                if (estado) {
                    estado.textContent =
                        resultado.mensaje;

                    estado.style.color = "green";
                }

                formulario.reset();

            } catch (error) {
                console.error(
                    "Error al enviar contacto:",
                    error
                );

                if (estado) {
                    estado.textContent =
                        "No se pudo enviar el mensaje. " +
                        "Inténtalo de nuevo.";

                    estado.style.color = "#b3261e";
                }

            } finally {
                if (boton) {
                    boton.disabled = false;
                }
            }
        }
    );
}

/* ==========================================
   INICIALIZACIÓN
========================================== */

function iniciarPagina() {
    actualizarCarrito();
    cargarProductos();
    configurarFormularioContacto();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarPagina
    );
} else {
    iniciarPagina();
}
