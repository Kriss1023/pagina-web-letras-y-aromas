
/* =========================================
   LETRAS & AROMAS
   PÁGINA NOSOTROS
========================================= */

let usuarioTemporal = null;
let temporizadorMensaje = null;

/* =========================================
   MENSAJES DE LA PÁGINA
========================================= */

function mostrarMensaje(texto) {
    const mensaje = document.getElementById("mensaje");

    if (!mensaje) {
        console.info(texto);
        return;
    }

    mensaje.textContent = texto;
    mensaje.classList.add("mostrar");

    clearTimeout(temporizadorMensaje);

    temporizadorMensaje = setTimeout(() => {
        mensaje.classList.remove("mostrar");
    }, 3500);
}

/* =========================================
   VENTANAS
========================================= */

function abrirVentana(id) {
    const ventana = document.getElementById(id);

    if (!ventana) return;

    ventana.classList.add("activa");
}

function cerrarVentana(id) {
    const ventana = document.getElementById(id);

    if (!ventana) return;

    ventana.classList.remove("activa");
}

/* =========================================
   INICIO DE SESIÓN
========================================= */

function abrirLogin() {
    cerrarRegistro();
    abrirVentana("modalLogin");
}

function cerrarLogin() {
    cerrarVentana("modalLogin");
}

/* =========================================
   REGISTRO
========================================= */

function abrirRegistro() {
    cerrarLogin();
    abrirVentana("modalRegistro");
}

function cerrarRegistro() {
    cerrarVentana("modalRegistro");
}

/* =========================================
   REGISTRO TEMPORAL
========================================= */

function registrarse(event) {
    event.preventDefault();

    const nombre = document
        .getElementById("registroNombre")
        .value.trim();

    const email = document
        .getElementById("registroEmail")
        .value.trim();

    const password = document
        .getElementById("registroPassword")
        .value;

    if (!nombre || !email || !password) {
        mostrarMensaje("Completa todos los campos.");
        return;
    }

    // Demostración temporal.
    // No se guarda en MongoDB ni localStorage.
    // No utilizar datos personales reales.

    usuarioTemporal = {
        nombre,
        email,
        password
    };

    event.target.reset();

    cerrarRegistro();

    mostrarMensaje(
        "Cuenta de demostración creada para esta visita."
    );
}

/* =========================================
   INICIAR SESIÓN TEMPORAL
========================================= */

function iniciarSesion(event) {
    event.preventDefault();

    const email = document
        .getElementById("loginEmail")
        .value.trim();

    const password = document
        .getElementById("loginPassword")
        .value;

    if (!usuarioTemporal) {
        mostrarMensaje(
            "Primero crea una cuenta de demostración."
        );

        return;
    }

    if (
        email === usuarioTemporal.email &&
        password === usuarioTemporal.password
    ) {
        cerrarLogin();

        event.target.reset();

        mostrarMensaje(
            "Bienvenido/a, " +
            usuarioTemporal.nombre + "."
        );

    } else {
        mostrarMensaje(
            "Correo o contraseña incorrectos."
        );
    }
}

/* =========================================
   CARRITO
========================================= */

function mostrarCarrito() {
    abrirVentana("modalCarrito");
}

function cerrarCarrito() {
    cerrarVentana("modalCarrito");
}

/*
   El carrito compartido entre Inicio,
   Catálogo y Nosotros se implementará
   en una siguiente etapa.
*/

function comprar() {
    mostrarMensaje(
        "Los pedidos todavía no están habilitados desde esta página."
    );
}

/* =========================================
   ÚNETE A NUESTRA COMUNIDAD
========================================= */


async function suscribirse(event) {
    event.preventDefault();

    const formulario = event.currentTarget;

    const correo =
        document.getElementById("correoNewsletter");

    const acepto =
        document.getElementById("aceptoComunidad");

    const estado =
        document.getElementById("estadoSuscripcion");

    const boton =
        formulario.querySelector('button[type="submit"]');

    if (!correo || !acepto || !estado || !boton) {
        return;
    }

    if (!acepto.checked) {
        estado.textContent =
            "Debes aceptar recibir novedades.";

        return;
    }

    boton.disabled = true;
    boton.textContent = "Registrando...";

    estado.textContent = "Guardando solicitud...";

    try {

        const respuesta = await fetch(
            "/api/suscripciones",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo: correo.value.trim(),
                    consentimiento: true
                })
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje ||
                "No se pudo registrar el correo."
            );
        }

        estado.textContent = resultado.mensaje;
        estado.style.color = "#28744d";

        formulario.reset();

    } catch (error) {

        console.error("Error en la suscripción:", error);

        estado.textContent =
            error.message ||
            "Ocurrió un problema al registrar el correo.";

        estado.style.color = "#b3261e";

    } finally {

        boton.disabled = false;
        boton.textContent = "Suscribirme";
    }
}

/* =========================================
   FORMULARIO DE CONTACTO
   CONECTADO CON MONGODB
========================================= */

function configurarFormularioContacto() {
    const formulario = document.getElementById(
        "formularioContacto"
    );

    if (!formulario) return;

    formulario.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const respuestaContacto =
                document.getElementById(
                    "respuestaContacto"
                );

            const botonEnviar =
                formulario.querySelector(
                    'button[type="submit"]'
                );

            /* Obtener los datos del formulario */

            const nombre = document
                .getElementById("nombreContacto")
                .value.trim();

            const email = document
                .getElementById("emailContacto")
                .value.trim();

            const asunto = document
                .getElementById("asuntoContacto")
                .value.trim();

            const mensaje = document
                .getElementById("mensajeContacto")
                .value.trim();

            if (
                !nombre ||
                !email ||
                !asunto ||
                !mensaje
            ) {
                if (respuestaContacto) {
                    respuestaContacto.textContent =
                        "Completa todos los campos.";

                    respuestaContacto.style.color =
                        "#b3261e";
                }

                return;
            }

            const datos = {
                nombre,
                email,
                asunto,
                mensaje
            };

            /* Evitar múltiples envíos */

            if (botonEnviar) {
                botonEnviar.disabled = true;
                botonEnviar.textContent =
                    "Enviando mensaje...";
            }

            if (respuestaContacto) {
                respuestaContacto.textContent =
                    "Enviando tu mensaje...";

                respuestaContacto.style.color =
                    "";
            }

            try {

                /* Enviar los datos al servidor */

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
                        "No se pudo enviar el mensaje."
                    );
                }

                /* Mensaje enviado correctamente */

                if (respuestaContacto) {
                    respuestaContacto.textContent =
                        resultado.mensaje ||
                        "Tu mensaje se envió correctamente.";

                    respuestaContacto.style.color =
                        "#28744d";
                }

                formulario.reset();

                mostrarMensaje(
                    "Mensaje enviado correctamente."
                );

            } catch (error) {

                console.error(
                    "Error al enviar el mensaje:",
                    error
                );

                if (respuestaContacto) {
                    respuestaContacto.textContent =
                        "No se pudo enviar el mensaje. " +
                        "Inténtalo nuevamente.";

                    respuestaContacto.style.color =
                        "#b3261e";
                }

            } finally {

                if (botonEnviar) {
                    botonEnviar.disabled = false;
                    botonEnviar.textContent =
                        "Enviar mensaje";
                }
            }
        }
    );
}

/* =========================================
   CERRAR VENTANAS
========================================= */

// Cerrar al hacer clic fuera del contenido.

window.addEventListener(
    "click",
    function(event) {

        const ventanas = [
            "modalLogin",
            "modalRegistro",
            "modalCarrito"
        ];

        ventanas.forEach(id => {
            const ventana =
                document.getElementById(id);

            if (
                ventana &&
                event.target === ventana
            ) {
                cerrarVentana(id);
            }
        });
    }
);

// Cerrar con la tecla Escape.

window.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {
            cerrarLogin();
            cerrarRegistro();
            cerrarCarrito();
        }
    }
);

/* =========================================
   INICIAR FUNCIONES
========================================= */

function iniciarPagina() {
    configurarFormularioContacto();

    // Estado temporal del carrito.
    const contador =
        document.getElementById("contador");

    if (contador) {
        contador.textContent = "0";
    }
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarPagina
    );
} else {
    iniciarPagina();
}
