
require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");

const Producto = require("./models/producto.js");
const Contacto = require("./models/contacto.js");

const PORT = process.env.PORT || 3000;

// Direcciones permitidas durante el desarrollo
const origenesPermitidos = [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
];

// Función para enviar respuestas JSON
function enviarJSON(response, estado, datos) {
    response.writeHead(estado, {
        "Content-Type": "application/json; charset=utf-8"
    });

    response.end(JSON.stringify(datos));
}

// Crear servidor
const server = http.createServer(async (request, response) => {

    // CONFIGURACIÓN DE CORS
    const origen = request.headers.origin;

    if (origenesPermitidos.includes(origen)) {
        response.setHeader("Access-Control-Allow-Origin", origen);
        response.setHeader("Vary", "Origin");
    }

    response.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );

    response.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // Responder solicitudes OPTIONS
    if (request.method === "OPTIONS") {
        response.writeHead(204);
        response.end();
        return;
    }

    // PÁGINA PRINCIPAL DEL SERVIDOR
    if (request.method === "GET" && request.url === "/") {

        response.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        response.end("Bienvenidos a Letras y Aromas");

    // CONSULTAR PRODUCTOS DESDE MONGODB
    } else if (
        request.method === "GET" &&
        request.url === "/api/productos"
    ) {

        try {
            const productos = await Producto.find();

            enviarJSON(response, 200, productos);

        } catch (error) {
            console.error(
                "Error al consultar productos:",
                error.message
            );

            enviarJSON(response, 500, {
                mensaje: "Error al obtener los productos"
            });
        }

    // GUARDAR MENSAJES DEL FORMULARIO DE CONTACTO
    } else if (
        request.method === "POST" &&
        request.url === "/api/contacto"
    ) {

        try {
            let cuerpo = "";
            let bytesRecibidos = 0;
            const LIMITE = 10000;

            // Recibir los datos enviados por el formulario
            for await (const fragmento of request) {
                bytesRecibidos += fragmento.length;

                if (bytesRecibidos > LIMITE) {
                    enviarJSON(response, 413, {
                        mensaje: "El mensaje es demasiado grande"
                    });
                    return;
                }

                cuerpo += fragmento.toString("utf8");
            }

            // Convertir los datos JSON en un objeto
            let datos;

            try {
                datos = JSON.parse(cuerpo);
            } catch {
                enviarJSON(response, 400, {
                    mensaje: "Los datos enviados no son válidos"
                });
                return;
            }

            if (
                !datos ||
                typeof datos !== "object" ||
                Array.isArray(datos)
            ) {
                enviarJSON(response, 400, {
                    mensaje: "Formato de datos incorrecto"
                });
                return;
            }

            // Validar los datos del formulario
            const campos = ["nombre", "email", "asunto", "mensaje"];

            if (campos.some(campo => typeof datos[campo] !== "string")) {
                enviarJSON(response, 400, {
                    mensaje: "Todos los campos deben contener texto"
                });
                return;
            }

            const nombre = datos.nombre.trim();
            const email = datos.email.trim();
            const asunto = datos.asunto.trim();
            const mensaje = datos.mensaje.trim();

            const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (
                !nombre ||
                !email ||
                !asunto ||
                !mensaje ||
                !correoValido ||
                nombre.length > 100 ||
                email.length > 254 ||
                asunto.length > 150 ||
                mensaje.length > 2000
            ) {
                enviarJSON(response, 400, {
                    mensaje: "Revisa los datos del formulario"
                });
                return;
            }

            // Guardar el mensaje en MongoDB
            await Contacto.create({
                nombre,
                email,
                asunto,
                mensaje
            });

            console.log("Nuevo mensaje de contacto guardado");

            enviarJSON(response, 201, {
                mensaje: "¡Tu mensaje fue enviado correctamente!"
            });

        } catch (error) {
            console.error(
                "Error al guardar contacto:",
                error.message
            );

            enviarJSON(response, 500, {
                mensaje: "No se pudo guardar el mensaje"
            });
        }

    // RUTA NO ENCONTRADA
    } else {

        enviarJSON(response, 404, {
            mensaje: "Ruta no encontrada"
        });
    }
});

// CONECTAR MONGODB E INICIAR SERVIDOR
async function iniciarServidor() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "Falta MONGODB_URI en el archivo .env"
            );
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB conectado correctamente");

        server.listen(PORT, () => {
            console.log(
                `Servidor ejecutándose en el puerto ${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Error al conectar con MongoDB:",
            error.message
        );

        process.exitCode = 1;
    }
}

iniciarServidor();
