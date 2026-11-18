
/* =================================
   LETRAS & AROMAS
   SCRIPT PRINCIPAL UNIFICADO
================================= */

let carrito = [];
let productosServidor = [];

/* =================================
   CARRITO DE COMPRAS
================================= */

// Agregar producto al carrito
function agregarCarrito(nombre, precio) {
    carrito.push({
        nombre: nombre,
        precio: Number(precio)
    });

    actualizarCarrito();
    mostrarMensaje("🛒 " + nombre + " agregado al carrito");
}

// Actualizar productos y total del carrito
function actualizarCarrito() {
    const contador = document.getElementById("contador");
    const lista = document.getElementById("listaCarrito");
    const total = document.getElementById("totalCarrito");

    // Evitar errores si no existe el carrito en la página
    if (!contador || !lista || !total) {
        return;
    }

    contador.textContent = carrito.length;
    lista.innerHTML = "";

    if (carrito.length === 0) {
        const aviso = document.createElement("p");
        aviso.textContent = "Tu carrito está vacío";
        lista.appendChild(aviso);

        total.textContent = "$0.00";
        return;
    }

    let suma = 0;

    carrito.forEach((producto, index) => {
        suma += producto.precio;

        const item = document.createElement("div");
        item.classList.add("item-carrito");

        const informacion = document.createElement("div");

        const nombreProducto = document.createElement("strong");
        nombreProducto.textContent = producto.nombre;

        const salto = document.createElement("br");

        const precioProducto = document.createElement("small");
        precioProducto.textContent =
            "$" + producto.precio.toFixed(2);

        informacion.appendChild(nombreProducto);
        informacion.appendChild(salto);
        informacion.appendChild(precioProducto);

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "×";
        botonEliminar.type = "button";

        botonEliminar.addEventListener("click", () => {
            eliminarProducto(index);
        });

        item.appendChild(informacion);
        item.appendChild(botonEliminar);

        lista.appendChild(item);
    });

    total.textContent = "$" + suma.toFixed(2);
}

// Eliminar producto del carrito
function eliminarProducto(index) {
    if (index < 0 || index >= carrito.length) {
        return;
    }

    carrito.splice(index, 1);

    actualizarCarrito();
    mostrarMensaje("Producto eliminado 🗑️");
}

// Abrir carrito
function mostrarCarrito() {
    const modal = document.getElementById("modalCarrito");

    if (modal) {
        modal.classList.add("activa");
    }
}

// Cerrar carrito
function cerrarCarrito() {
    const modal = document.getElementById("modalCarrito");

    if (modal) {
        modal.classList.remove("activa");
    }
}

// Simulación de compra
function comprar() {
    if (carrito.length === 0) {
        mostrarMensaje("Tu carrito está vacío");
        return;
    }

    mostrarMensaje(
        "Compra de demostración. Aún no se ha realizado un pedido real."
    );

    carrito = [];

    actualizarCarrito();
    cerrarCarrito();
}

/* =================================
   PRODUCTOS DESDE MONGODB
================================= */

// Consultar productos del servidor y mostrarlos en la página
async function cargarProductos() {
    const contenedor = document.getElementById("productosNuevos");

    // Si el contenedor no existe, no hacemos nada
    if (!contenedor) {
        return;
    }

    try {
        const respuesta = await fetch("/api/productos");

        if (!respuesta.ok) {
            throw new Error("Error al consultar los productos");
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error("Formato de productos incorrecto");
        }

        productosServidor = datos;

    } catch (error) {
        console.error("Error al cargar productos:", error);

        contenedor.innerHTML =
            "<p>No se pudieron cargar los productos.</p>";

        return;
    }

    // Si no existen productos
    if (productosServidor.length === 0) {
        contenedor.innerHTML =
            "<p>Pronto habrá productos nuevos.</p>";

        return;
    }

    contenedor.innerHTML = "";

    // Crear tarjetas de productos
    productosServidor.forEach((producto, index) => {

        const tarjeta = document.createElement("article");
        tarjeta.classList.add("producto");

        // Imagen
        const contenedorImagen = document.createElement("div");
        contenedorImagen.classList.add("producto-imagen");

        if (producto.imagen) {
            const imagen = document.createElement("img");

            imagen.src = "carpeta de imagenes/" + producto.imagen;
            imagen.alt = producto.nombre || "Producto";

            contenedorImagen.appendChild(imagen);
        }

        tarjeta.appendChild(contenedorImagen);

        // Información
        const informacion = document.createElement("div");
        informacion.classList.add("producto-info");

        const categoria = document.createElement("span");
        categoria.classList.add("categoria");
        categoria.textContent =
            String(producto.categoria || "").toUpperCase();

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre || "Sin nombre";

        const descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion || "";

        informacion.appendChild(categoria);
        informacion.appendChild(nombre);
        informacion.appendChild(descripcion);

        // Precio y botón
        const parteInferior = document.createElement("div");
        parteInferior.classList.add("producto-abajo");

        const precio = document.createElement("strong");

        precio.textContent =
            "$" + Number(producto.precio || 0).toFixed(2);

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Agregar 🛒";

        boton.addEventListener("click", () => {
            agregarDelServidor(index);
        });

        parteInferior.appendChild(precio);
        parteInferior.appendChild(boton);

        informacion.appendChild(parteInferior);
        tarjeta.appendChild(informacion);

        contenedor.appendChild(tarjeta);
    });
}

// Agregar un producto del servidor al carrito
function agregarDelServidor(index) {
    const producto = productosServidor[index];

    if (!producto) {
        mostrarMensaje("No se encontró el producto");
        return;
    }

    agregarCarrito(
        producto.nombre,
        Number(producto.precio)
    );
}

/* =================================
   LOGIN
================================= */

function abrirLogin() {
    cerrarRegistro();

    const modal = document.getElementById("modalLogin");

    if (modal) {
        modal.classList.add("activa");
    }
}

function cerrarLogin() {
    const modal = document.getElementById("modalLogin");

    if (modal) {
        modal.classList.remove("activa");
    }
}

/* =================================
   REGISTRO DE USUARIOS
   SOLO PARA DEMOSTRACIÓN
================================= */

function abrirRegistro() {
    cerrarLogin();

    const modal = document.getElementById("modalRegistro");

    if (modal) {
        modal.classList.add("activa");
    }
}

function cerrarRegistro() {
    const modal = document.getElementById("modalRegistro");

    if (modal) {
        modal.classList.remove("activa");
    }
}

// Registro de demostración
function registrarse(event) {
    event.preventDefault();

    const nombre = document
        .getElementById("registroNombre").value.trim();

    const email = document
        .getElementById("registroEmail").value.trim();

    const password = document
        .getElementById("registroPassword").value;

    if (!nombre || !email || !password) {
        mostrarMensaje("Completa todos los campos");
        return;
    }

    // Esta función es solo una demostración local.
    // No debe utilizarse con contraseñas reales.

    const usuario = {
        nombre: nombre,
        email: email,
        password: password
    };

    localStorage.setItem(
        "usuarioLetrasAromas",
        JSON.stringify(usuario)
    );

    cerrarRegistro();

    mostrarMensaje(
        "¡Cuenta de demostración creada correctamente!"
    );

    document.getElementById("registroNombre").value = "";
    document.getElementById("registroEmail").value = "";
    document.getElementById("registroPassword").value = "";
}

/* =================================
   INICIAR SESIÓN
   SOLO PARA DEMOSTRACIÓN
================================= */

function iniciarSesion(event) {
    event.preventDefault();

    const email = document
        .getElementById("loginEmail").value;

    const password = document
        .getElementById("loginPassword").value;

    const datos = localStorage.getItem("usuarioLetrasAromas");

    if (!datos) {
        mostrarMensaje("Primero debes crear una cuenta 🌸");
        return;
    }

    let usuario;

    try {
        usuario = JSON.parse(datos);
    } catch (error) {
        mostrarMensaje("No se pudieron leer los datos de la cuenta");
        return;
    }

    if (
        email === usuario.email &&
        password === usuario.password
    ) {
        cerrarLogin();

        mostrarMensaje(
            "¡Bienvenido/a, " + usuario.nombre + "!"
        );
    } else {
        mostrarMensaje("Correo o contraseña incorrectos");
    }
}

/* =================================
   NEWSLETTER
================================= */

function suscribirse(event) {
    event.preventDefault();

    const campo = document.getElementById("correoNewsletter");

    if (!campo) {
        return;
    }

    const correo = campo.value.trim();

    if (correo) {
        // Confirmación visual: aún no guarda suscriptores.
        mostrarMensaje(
            "Suscripción de demostración registrada en pantalla"
        );

        campo.value = "";
    }
}

/* =================================
   MENSAJES EMERGENTES
================================= */

function mostrarMensaje(texto) {
    const mensaje = document.getElementById("mensaje");

    if (!mensaje) {
        console.log(texto);
        return;
    }

    mensaje.textContent = texto;
    mensaje.classList.add("mostrar");

    setTimeout(() => {
        mensaje.classList.remove("mostrar");
    }, 3000);
}

/* =================================
   CERRAR MODALES HACIENDO CLIC AFUERA
================================= */

window.addEventListener("click", function (event) {

    const login = document.getElementById("modalLogin");
    const registro = document.getElementById("modalRegistro");
    const carritoModal = document.getElementById("modalCarrito");

    if (login && event.target === login) {
        cerrarLogin();
    }

    if (registro && event.target === registro) {
        cerrarRegistro();
    }

    if (carritoModal && event.target === carritoModal) {
        cerrarCarrito();
    }
});

/* =================================
   FORMULARIO DE CONTACTO
   CONECTADO CON MONGODB
================================= */

function configurarFormularioContacto() {

    const formularioContacto =
        document.getElementById("formularioContacto");

    if (!formularioContacto) {
        return;
    }

    formularioContacto.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const respuestaContacto =
                document.getElementById("respuestaContacto");

            const botonEnviar = formularioContacto.querySelector(
                'button[type="submit"]'
            );

            const datos = {
                nombre: document
                    .getElementById("nombreContacto")
                    .value.trim(),

                email: document
                    .getElementById("emailContacto")
                    .value.trim(),

                asunto: document
                    .getElementById("asuntoContacto")
                    .value.trim(),

                mensaje: document
                    .getElementById("mensajeContacto")
                    .value.trim()
            };

            if (botonEnviar) {
                botonEnviar.disabled = true;
            }

            if (respuestaContacto) {
                respuestaContacto.textContent =
                    "Enviando mensaje...";

                respuestaContacto.style.color = "";
            }

            try {
                // Ruta de la API del mismo servidor web
                const respuesta = await fetch("/api/contacto", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                });

                const resultado = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        resultado.mensaje ||
                        "No se pudo enviar el mensaje"
                    );
                }

                if (respuestaContacto) {
                    respuestaContacto.textContent =
                        resultado.mensaje;

                    respuestaContacto.style.color = "green";
                }

                formularioContacto.reset();

            } catch (error) {

                console.error(
                    "Error al enviar el formulario:",
                    error
                );

                if (respuestaContacto) {
                    respuestaContacto.textContent =
                        "No se pudo enviar el mensaje. Inténtalo nuevamente.";

                    respuestaContacto.style.color = "red";
                }

            } finally {

                if (botonEnviar) {
                    botonEnviar.disabled = false;
                }
            }
        }
    );
}

/* =================================
   INICIAR FUNCIONES DE LA PÁGINA
================================= */

function iniciarPagina() {

    // Actualizar carrito
    actualizarCarrito();

    // Cargar productos desde MongoDB
    cargarProductos();

    // Activar formulario de contacto
    configurarFormularioContacto();
}

// Esperar a que la página esté lista
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarPagina
    );
} else {
    iniciarPagina();
}
