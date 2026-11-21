
/* =========================================
   LETRAS & AROMAS - CATÁLOGO CON MONGODB
========================================= */

let productos = [];
const carrito = [];
let temporizadorMensaje;
let usuarioTemporal = null;

const dinero = cantidad =>
    "$" + Number(cantidad).toFixed(2);

/* =========================================
   OBTENER PRODUCTOS DE MONGODB
========================================= */

async function cargarProductos() {
    const libros = document.getElementById("productosLibros");
    const velas = document.getElementById("productosVelas");
    const destacados = document.getElementById("productosDestacados");

    if (!libros || !velas) return;

    libros.textContent = "Cargando libros...";
    velas.textContent = "Cargando velas...";

    if (destacados) {
        destacados.textContent = "Cargando destacados...";
    }

    try {
        const respuesta = await fetch("/api/productos");

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar el catálogo");
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error("El servidor no devolvió una lista válida");
        }

        productos = datos;
        renderizarProductos();

    } catch (error) {
        console.error("Error del catálogo:", error);

        const mensaje =
            "No se pudieron cargar los productos. Intenta actualizar la página.";

        libros.textContent = mensaje;
        velas.textContent = mensaje;

        if (destacados) {
            destacados.textContent = mensaje;
        }
    }
}

/* =========================================
   RUTAS DE IMÁGENES
========================================= */

function obtenerRutaImagen(imagen) {
    let ruta = String(imagen || "")
        .trim()
        .replace(/\\/g, "/");

    if (!ruta) return "";

    // Admitir imágenes externas HTTPS.
    if (/^https:\/\//i.test(ruta)) {
        return ruta;
    }

    // Los archivos locales se sirven desde public.
    ruta = ruta
        .replace(/^\/?public\//i, "")
        .replace(/^\/+/, "");

    if (
        /^[a-z]+:\/\//i.test(ruta) ||
        ruta.includes("..")
    ) {
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

/* =========================================
   CREAR TARJETAS DE PRODUCTOS
========================================= */

function crearTarjeta(producto) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "producto";

    // Imagen
    const contenedorImagen = document.createElement("div");
    contenedorImagen.className = "producto-imagen";

    const rutaImagen = obtenerRutaImagen(producto.imagen);

    const mostrarSinImagen = () => {
        contenedorImagen.replaceChildren();

        const aviso = document.createElement("span");
        aviso.textContent = "Imagen próximamente";

        contenedorImagen.appendChild(aviso);
    };

    if (rutaImagen) {
        const imagen = document.createElement("img");

        imagen.src = rutaImagen;
        imagen.alt = producto.nombre || "Producto";
        imagen.loading = "lazy";

        imagen.addEventListener(
            "error",
            mostrarSinImagen
        );

        contenedorImagen.appendChild(imagen);
    } else {
        mostrarSinImagen();
    }

    // Información
    const informacion = document.createElement("div");
    informacion.className = "producto-info";

    const categoria = document.createElement("span");
    categoria.className = "categoria";
    categoria.textContent = producto.categoria || "";

    const nombre = document.createElement("h3");
    nombre.textContent = producto.nombre || "Sin nombre";

    const descripcion = document.createElement("p");
    descripcion.textContent = producto.descripcion || "";

    // Precio y botón del carrito
    const parteInferior = document.createElement("div");
    parteInferior.className = "producto-abajo";

    const precio = document.createElement("strong");
    precio.textContent = dinero(producto.precio);

    const boton = document.createElement("button");
    boton.type = "button";

    const stock = Number(producto.stock || 0);

    if (stock <= 0) {
        boton.textContent = "Agotado";
        boton.disabled = true;
    } else {
        boton.textContent = "Agregar al carrito";

        boton.addEventListener("click", () => {
            agregarCarrito(producto);
        });
    }

    parteInferior.append(precio, boton);

    informacion.append(
        categoria,
        nombre,
        descripcion,
        parteInferior
    );

    tarjeta.append(
        contenedorImagen,
        informacion
    );

    return tarjeta;
}

/* =========================================
   MOSTRAR TODOS LOS PRODUCTOS
========================================= */

function renderizarProductos() {
    const contenedorLibros =
        document.getElementById("productosLibros");

    const contenedorVelas =
        document.getElementById("productosVelas");

    if (!contenedorLibros || !contenedorVelas) {
        return;
    }

    contenedorLibros.replaceChildren();
    contenedorVelas.replaceChildren();

    // Los productos se obtienen directamente de MongoDB.
    for (const tipo of ["libros", "velas"]) {
        const contenedor =
            tipo === "libros"
                ? contenedorLibros
                : contenedorVelas;

        const filtrados = productos.filter(
            producto => producto.tipo === tipo
        );

        if (filtrados.length === 0) {
            const aviso = document.createElement("p");

            aviso.textContent =
                "Pronto tendremos más productos disponibles.";

            contenedor.appendChild(aviso);
            continue;
        }

        filtrados.forEach(producto => {
            contenedor.appendChild(
                crearTarjeta(producto)
            );
        });
    }

    // Cargar la sección de destacados.
    renderizarDestacados();
}

/* =========================================
   CINCO PRODUCTOS DESTACADOS
========================================= */

// Normaliza nombres para reconocer mayúsculas
// y diferencias de acentuación.

function normalizarNombre(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function renderizarDestacados() {
    const contenedor =
        document.getElementById("productosDestacados");

    if (!contenedor) return;

    contenedor.replaceChildren();

    // Productos seleccionados para el catálogo.
    const seleccion = [
        {
            nombre: "Orgullo y prejuicio",
            tipo: "libros",
            palabras: ["orgullo", "prejuicio"]
        },
        {
            nombre: "En agosto nos vemos",
            tipo: "libros",
            palabras: ["agosto", "vemos"]
        },
        {
            nombre: "El jardín secreto",
            tipo: "libros",
            palabras: ["jardin", "secreto"]
        },
        {
            nombre: "Vela de manzana y canela",
            tipo: "velas",
            palabras: ["manzana", "canela"]
        },
        {
            nombre: "Vela de lavanda",
            tipo: "velas",
            palabras: ["lavanda"]
        }
    ];

    const faltantes = [];

    seleccion.forEach(item => {
        const producto = productos.find(p => {
            const nombre = normalizarNombre(p.nombre);

            return (
                p.tipo === item.tipo &&
                item.palabras.every(
                    palabra => nombre.includes(palabra)
                )
            );
        });

        if (producto) {
            contenedor.appendChild(
                crearTarjeta(producto)
            );
        } else {
            faltantes.push(item.nombre);
        }
    });

    // Avisar si falta un destacado en MongoDB.
    if (faltantes.length > 0) {
        const aviso = document.createElement("p");

        aviso.className = "catalogo-vacio";

        aviso.textContent =
            "No se encontraron en MongoDB: " +
            faltantes.join(", ") + ".";

        contenedor.appendChild(aviso);
    }
}

/* =========================================
   FILTROS DEL CATÁLOGO
========================================= */

function filtrar(tipo) {
    const filtrosValidos = [
        "todos",
        "libros",
        "velas",
        "destacados"
    ];

    if (!filtrosValidos.includes(tipo)) {
        tipo = "todos";
    }

    // Marcar visualmente el botón seleccionado.
    document.querySelectorAll("[data-filtro]")
        .forEach(boton => {
            const activo =
                boton.dataset.filtro === tipo;

            boton.setAttribute(
                "aria-pressed",
                String(activo)
            );

            boton.classList.toggle(
                "activo",
                activo
            );
        });

    const secciones = {
        libros: document.getElementById("libros"),
        velas: document.getElementById("velas"),
        destacados: document.getElementById("destacados")
    };

    // Mostrar todas las secciones con "Todos".
    // Los demás botones muestran una sola sección.

    if (secciones.libros) {
        secciones.libros.hidden =
            tipo !== "todos" &&
            tipo !== "libros";
    }

    if (secciones.velas) {
        secciones.velas.hidden =
            tipo !== "todos" &&
            tipo !== "velas";
    }

    if (secciones.destacados) {
        secciones.destacados.hidden =
            tipo !== "todos" &&
            tipo !== "destacados";
    }
}

// Activar botones de filtrado.
document.querySelectorAll("[data-filtro]")
    .forEach(boton => {
        boton.addEventListener("click", () => {
            filtrar(boton.dataset.filtro);
        });
    });

/* =========================================
   CARRITO DEL CATÁLOGO
========================================= */

function agregarCarrito(producto) {
    const stock = Number(producto.stock || 0);

    const cantidadActual = carrito.filter(
        item => item._id === producto._id
    ).length;

    // No permitir agregar más unidades
    // de las disponibles en stock.
    if (cantidadActual >= stock) {
        mostrarMensaje(
            "No hay más unidades disponibles"
        );

        return;
    }

    carrito.push(producto);

    actualizarCarrito();

    mostrarMensaje(
        producto.nombre + " agregado al carrito"
    );
}

function actualizarCarrito() {
    const contador = document.getElementById("contador");
    const lista = document.getElementById("listaCarrito");
    const total = document.getElementById("totalCarrito");

    if (!contador || !lista || !total) {
        return;
    }

    contador.textContent = carrito.length;
    lista.replaceChildren();

    if (carrito.length === 0) {
        const vacio = document.createElement("p");

        vacio.textContent = "Tu carrito está vacío";

        lista.appendChild(vacio);
    }

    carrito.forEach((producto, indice) => {
        const fila = document.createElement("p");

        fila.append(
            document.createTextNode(
                producto.nombre + " — " +
                dinero(producto.precio) + " "
            )
        );

        const quitar = document.createElement("button");

        quitar.type = "button";
        quitar.textContent = "Quitar";

        quitar.addEventListener("click", () => {
            carrito.splice(indice, 1);
            actualizarCarrito();
        });

        fila.appendChild(quitar);
        lista.appendChild(fila);
    });

    const suma = carrito.reduce(
        (total, producto) =>
            total + Number(producto.precio),
        0
    );

    total.textContent = dinero(suma);
}

/* =========================================
   MENSAJES
========================================= */

function mostrarMensaje(texto) {
    const mensaje = document.getElementById("mensaje");

    if (!mensaje) return;

    mensaje.textContent = texto;
    mensaje.hidden = false;
    mensaje.classList.add("mostrar");

    clearTimeout(temporizadorMensaje);

    temporizadorMensaje = setTimeout(() => {
        mensaje.classList.remove("mostrar");
        mensaje.hidden = true;
    }, 2500);
}

/* =========================================
   ABRIR Y CERRAR CARRITO
========================================= */

const modal = document.getElementById("modalCarrito");

function abrirCarrito() {
    if (!modal) return;

    modal.hidden = false;
    modal.classList.add("activa");
}

function cerrarCarrito() {
    if (!modal) return;

    modal.classList.remove("activa");
    modal.hidden = true;
}

// Botón para abrir el carrito.
document.getElementById("abrirCarrito")
    ?.addEventListener("click", abrirCarrito);

// Botón para cerrar el carrito.
document.getElementById("cerrarCarrito")
    ?.addEventListener("click", cerrarCarrito);

/* =========================================
   VENTANAS DE USUARIO
   SOLO DEMOSTRACIÓN
========================================= */

function abrirVentana(id) {
    const ventana = document.getElementById(id);

    if (!ventana) return;

    ventana.hidden = false;
    ventana.classList.add("activa");
}

function cerrarVentana(id) {
    const ventana = document.getElementById(id);

    if (!ventana) return;

    ventana.classList.remove("activa");
    ventana.hidden = true;
}

// Abrir inicio de sesión.
document.getElementById("abrirLogin")
    ?.addEventListener("click", () => {
        cerrarVentana("modalRegistro");
        abrirVentana("modalLogin");
    });

// Cerrar inicio de sesión.
document.getElementById("cerrarLogin")
    ?.addEventListener("click", () => {
        cerrarVentana("modalLogin");
    });

// Cerrar registro.
document.getElementById("cerrarRegistro")
    ?.addEventListener("click", () => {
        cerrarVentana("modalRegistro");
    });

// Cambiar de inicio de sesión a registro.
document.getElementById("irRegistro")
    ?.addEventListener("click", () => {
        cerrarVentana("modalLogin");
        abrirVentana("modalRegistro");
    });

// Cambiar de registro a inicio de sesión.
document.getElementById("irLogin")
    ?.addEventListener("click", () => {
        cerrarVentana("modalRegistro");
        abrirVentana("modalLogin");
    });

/* =========================================
   REGISTRO DE DEMOSTRACIÓN
========================================= */

document.getElementById("formularioRegistro")
    ?.addEventListener("submit", event => {
        event.preventDefault();

        const nombre = document
            .getElementById("registroNombre")
            .value.trim();

        const email = document
            .getElementById("registroEmail")
            .value.trim();

        const clave = document
            .getElementById("registroPassword")
            .value;

        // Cuenta temporal, válida solo durante
        // esta visita a la página.
        // No se guarda en MongoDB ni localStorage.

        usuarioTemporal = {
            nombre,
            email,
            clave
        };

        event.target.reset();

        cerrarVentana("modalRegistro");

        mostrarMensaje(
            "Cuenta de demostración creada para esta visita"
        );
    });

/* =========================================
   INICIO DE SESIÓN DE DEMOSTRACIÓN
========================================= */

document.getElementById("formularioLogin")
    ?.addEventListener("submit", event => {
        event.preventDefault();

        const email = document
            .getElementById("loginEmail")
            .value.trim();

        const clave = document
            .getElementById("loginPassword")
            .value;

        if (
            usuarioTemporal &&
            email === usuarioTemporal.email &&
            clave === usuarioTemporal.clave
        ) {
            cerrarVentana("modalLogin");

            mostrarMensaje(
                "Bienvenido/a, " + usuarioTemporal.nombre
            );
        } else {
            mostrarMensaje(
                "No existe una cuenta de prueba con esos datos"
            );
        }
    });

/* =========================================
   CERRAR VENTANAS
========================================= */

// Cerrar al hacer clic fuera de la ventana.
window.addEventListener("click", event => {
    if (event.target === modal) {
        cerrarCarrito();
    }

    for (const id of ["modalLogin", "modalRegistro"]) {
        if (
            event.target === document.getElementById(id)
        ) {
            cerrarVentana(id);
        }
    }
});

// Cerrar con la tecla Escape.
window.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        cerrarCarrito();
        cerrarVentana("modalLogin");
        cerrarVentana("modalRegistro");
    }
});

/* =========================================
   INICIAR CATÁLOGO
========================================= */

const parametros = new URLSearchParams(
    window.location.search
);

const tipoInicial = parametros.get("tipo");

filtrar(
    ["libros", "velas", "destacados"].includes(tipoInicial)
        ? tipoInicial
        : "todos"
);

actualizarCarrito();
cargarProductos();
/* COMPRA DE DEMOSTRACIÓN */

document.getElementById("botonCompraDemo")
    ?.addEventListener("click", () => {

        const mensaje = document.getElementById(
            "mensajeCompraDemo"
        );

        if (!mensaje) return;

        if (carrito.length === 0) {
            mensaje.textContent =
                "Primero agrega un producto al carrito.";

            mensaje.hidden = false;
            return;
        }

        mensaje.textContent =
            "¡Gracias por elegir Letras & Aromas! " +
            "Esta es una compra de demostración. ";
        mensaje.hidden = false;
    });