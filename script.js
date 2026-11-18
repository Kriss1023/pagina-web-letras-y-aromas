/* =================================
   CARRITO
================================= */
let carrito = [];
/* AGREGAR PRODUCTO */

function agregarCarrito(nombre, precio) {

    carrito.push({
        nombre: nombre,
        precio: precio
    });

    actualizarCarrito();

    mostrarMensaje("🛒 " + nombre + " agregado al carrito");
}
/* ACTUALIZAR CARRITO */

function actualizarCarrito() {

    const contador = document.getElementById("contador");

    contador.textContent = carrito.length;


    const lista = document.getElementById("listaCarrito");

    const total = document.getElementById("totalCarrito");


    if (carrito.length === 0) {

        lista.innerHTML = `
            <p>Tu carrito está vacío </p>
        `;

        total.textContent = "$0.00";

        return;
    }


    lista.innerHTML = "";


    let suma = 0;


    carrito.forEach((producto, index) => {

        suma += producto.precio;


        const item = document.createElement("div");

        item.classList.add("item-carrito");


        item.innerHTML = `

            <div>
                <strong>${producto.nombre}</strong>
                <br>
                <small>$${producto.precio.toFixed(2)}</small>
            </div>

            <button onclick="eliminarProducto(${index})">
                ×
            </button>

        `;


        lista.appendChild(item);

    });


    total.textContent = "$" + suma.toFixed(2);
}


/* ELIMINAR PRODUCTO */

function eliminarProducto(index) {

    carrito.splice(index, 1);

    actualizarCarrito();

    mostrarMensaje("Producto eliminado 🗑️");
}


/* MOSTRAR CARRITO */

function mostrarCarrito() {

    document
        .getElementById("modalCarrito")
        .classList.add("activa");

}


/* CERRAR CARRITO */

function cerrarCarrito() {

    document
        .getElementById("modalCarrito")
        .classList.remove("activa");

}


/* COMPRAR */

function comprar() {

    if (carrito.length === 0) {

        mostrarMensaje("Tu carrito está vacío ");

        return;
    }


    mostrarMensaje(
        " Gracias por tu compra. ¡Te contactaremos pronto!"
    );

    carrito = [];

    actualizarCarrito();

    cerrarCarrito();
}


/* =================================
   LOGIN
================================= */

function abrirLogin() {

    cerrarRegistro();

    document
        .getElementById("modalLogin")
        .classList.add("activa");
}


function cerrarLogin() {

    document
        .getElementById("modalLogin")
        .classList.remove("activa");
}


/* =================================
   REGISTRO
================================= */

function abrirRegistro() {

    cerrarLogin();

    document
        .getElementById("modalRegistro")
        .classList.add("activa");
}


function cerrarRegistro() {

    document
        .getElementById("modalRegistro")
        .classList.remove("activa");
}
/* CREAR CUENTA */

function registrarse(event) {

    event.preventDefault();


    const nombre =
        document.getElementById("registroNombre").value;

    const email =
        document.getElementById("registroEmail").value;

    const password =
        document.getElementById("registroPassword").value;


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
        " ¡Cuenta creada correctamente!"
    );


    document.getElementById("registroNombre").value = "";

    document.getElementById("registroEmail").value = "";

    document.getElementById("registroPassword").value = "";
}


/* =================================
   INICIAR SESIÓN
================================= */

function iniciarSesion(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;


    const datos =
        localStorage.getItem("usuarioLetrasAromas");


    if (!datos) {

        mostrarMensaje(
            "Primero debes crear una cuenta 🌸"
        );

        return;
    }


    const usuario = JSON.parse(datos);


    if (
        email === usuario.email &&
        password === usuario.password
    ) {

        cerrarLogin();


        mostrarMensaje(
            " ¡Bienvenido/a, " + usuario.nombre + "!"
        );

    } else {

        mostrarMensaje(
            " Correo o contraseña incorrectos"
        );

    }

}
/* =================================
   NEWSLETTER
================================= */

function suscribirse(event) {

    event.preventDefault();


    const correo =
        document.getElementById("correoNewsletter").value;


    if (correo) {

        mostrarMensaje(
            " ¡Gracias por suscribirte!"
        );


        document.getElementById(
            "correoNewsletter"
        ).value = "";

    }

}
/* =================================
   MENSAJES
================================= */

function mostrarMensaje(texto) {

    const mensaje =
        document.getElementById("mensaje");


    mensaje.textContent = texto;


    mensaje.classList.add("mostrar");


    setTimeout(() => {

        mensaje.classList.remove("mostrar");

    }, 3000);

}


/* =================================
   CERRAR MODALES AL HACER CLIC
   AFUERA
================================= */

window.addEventListener("click", function(event) {

    const login =
        document.getElementById("modalLogin");

    const registro =
        document.getElementById("modalRegistro");

    const carritoModal =
        document.getElementById("modalCarrito");


    if (event.target === login) {

        cerrarLogin();

    }


    if (event.target === registro) {

        cerrarRegistro();

    }


    if (event.target === carritoModal) {

        cerrarCarrito();

    }

});
/* =================================
   INICIAR
================================= */

actualizarCarrito();

/* FORMULARIO DE CONTACTO - LETRAS & AROMAS */

const formularioContacto = document.getElementById("formularioContacto");

if (formularioContacto) {
    formularioContacto.addEventListener("submit", async function(event) {
        event.preventDefault();

        const respuestaContacto = document.getElementById("respuestaContacto");
        const botonEnviar = formularioContacto.querySelector('button[type="submit"]');

        const datos = {
            nombre: document.getElementById("nombreContacto").value.trim(),
            email: document.getElementById("emailContacto").value.trim(),
            asunto: document.getElementById("asuntoContacto").value.trim(),
            mensaje: document.getElementById("mensajeContacto").value.trim()
        };

        botonEnviar.disabled = true;
        respuestaContacto.textContent = "Enviando mensaje...";

        try {
            const respuesta = await fetch("http://localhost:3000/api/contacto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje || "No se pudo enviar el mensaje");
            }

            respuestaContacto.textContent = resultado.mensaje;
            respuestaContacto.style.color = "green";

            formularioContacto.reset();

        } catch (error) {
            respuestaContacto.textContent = error.message;
            respuestaContacto.style.color = "red";

        } finally {
            botonEnviar.disabled = false;
        }
    });
}
