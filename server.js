
require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const Producto = require("./models/producto.js");
const Contacto = require("./models/contacto.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración general
app.use(express.json({ limit: "10kb" }));

// Suscripciones de la comunidad
app.use(
    "/api/suscripciones",
    require("./routes/suscripciones.js")
);

// Direcciones permitidas
const origenesPermitidos = [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
];

app.use((req, res, next) => {
    const origen = req.headers.origin;

    if (origenesPermitidos.includes(origen)) {
        res.setHeader("Access-Control-Allow-Origin", origen);
        res.setHeader("Vary", "Origin");
    }

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// Protección del administrador
function protegerAdmin(req, res, next) {
    const usuarioConfigurado = process.env.ADMIN_USER;
    const claveConfigurada = process.env.ADMIN_PASS;

    if (!usuarioConfigurado || !claveConfigurada) {
        return res.status(503).send(
            "Panel administrativo sin configurar"
        );
    }

    const autorizacion = req.headers.authorization || "";
    const partes = autorizacion.split(" ");

    if (partes[0] === "Basic" && partes[1]) {
        const credenciales = Buffer.from(
            partes[1],
            "base64"
        ).toString("utf8");

        const separador = credenciales.indexOf(":");

        const usuario = credenciales.slice(0, separador);
        const clave = credenciales.slice(separador + 1);

        if (
            separador !== -1 &&
            usuario === usuarioConfigurado &&
            clave === claveConfigurada
        ) {
            return next();
        }
    }

    res.set(
        "WWW-Authenticate",
        'Basic realm="Administracion Letras y Aromas"'
    );

    return res.status(401).send("Acceso restringido");
}

// Validar información de productos

function revisarProducto(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { error: "Datos de producto inválidos" };
    }

    const nombre = String(body.nombre || "").trim();
    const tipo = String(body.tipo || "").trim().toLowerCase();
    const categoria = String(body.categoria || "").trim();
    const precio = Number(body.precio);
    const stock = Number(body.stock);

    if (!nombre) {
        return { error: "El nombre es obligatorio" };
    }

    if (!["libros", "velas"].includes(tipo)) {
        return {
            error: "Selecciona si el producto es un libro o una vela"
        };
    }

    if (!categoria) {
        return { error: "La categoría es obligatoria" };
    }

    if (!Number.isFinite(precio) || precio < 0) {
        return { error: "Precio inválido" };
    }

    if (!Number.isInteger(stock) || stock < 0) {
        return { error: "Stock inválido" };
    }

    return {
        datos: {
            nombre,
            tipo,
            categoria,
            precio,
            stock,
            imagen: String(body.imagen || "").trim(),
            descripcion: String(body.descripcion || "").trim()
        }
    };
}


// API pública: productos
app.get("/api/productos", async (req, res) => {
    try {
        const productos = await Producto.find().lean();
        res.json(productos);
    } catch (error) {
        console.error("Error al consultar productos:", error.message);

        res.status(500).json({
            mensaje: "Error al obtener los productos"
        });
    }
});

// API pública: contacto
app.post("/api/contacto", async (req, res) => {
    try {
        const datos = req.body;

        if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
            return res.status(400).json({
                mensaje: "Formato de datos incorrecto"
            });
        }

        const campos = ["nombre", "email", "asunto", "mensaje"];

        if (campos.some(campo => typeof datos[campo] !== "string")) {
            return res.status(400).json({
                mensaje: "Todos los campos deben contener texto"
            });
        }

        const nombre = datos.nombre.trim();
        const email = datos.email.trim();
        const asunto = datos.asunto.trim();
        const mensaje = datos.mensaje.trim();

        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (
            !nombre || !email || !asunto || !mensaje ||
            !correoValido ||
            nombre.length > 100 ||
            email.length > 254 ||
            asunto.length > 150 ||
            mensaje.length > 2000
        ) {
            return res.status(400).json({
                mensaje: "Revisa los datos del formulario"
            });
        }

        await Contacto.create({
            nombre,
            email,
            asunto,
            mensaje
        });

        console.log("Nuevo mensaje de contacto guardado");

        res.status(201).json({
            mensaje: "¡Tu mensaje fue enviado correctamente!"
        });

    } catch (error) {
        console.error("Error al guardar contacto:", error.message);

        res.status(500).json({
            mensaje: "No se pudo guardar el mensaje"
        });
    }
});

// Todas las rutas del administrador requieren autorización
app.use("/admin", protegerAdmin);

// Consultar productos desde el administrador
app.get("/admin/api/productos", async (req, res) => {
    try {
        const productos = await Producto.find()
            .sort({ createdAt: -1 })
            .lean();

        res.json(productos);
    } catch (error) {
        res.status(500).json({
            error: "No se pudieron consultar los productos"
        });
    }
});

// Crear producto
app.post("/admin/api/productos", async (req, res) => {
    try {
        const resultado = revisarProducto(req.body);

        if (resultado.error) {
            return res.status(400).json({
                error: resultado.error
            });
        }

        const producto = await Producto.create(resultado.datos);

        res.status(201).json(producto);
    } catch (error) {
        console.error("Error al crear producto:", error.message);

        res.status(500).json({
            error: "No se pudo crear el producto"
        });
    }
});

// Actualizar producto
app.put("/admin/api/productos/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                error: "Identificador inválido"
            });
        }

        const resultado = revisarProducto(req.body);

        if (resultado.error) {
            return res.status(400).json({
                error: resultado.error
            });
        }

        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            { $set: resultado.datos },
            { new: true, runValidators: true }
        );

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);
    } catch (error) {
        res.status(500).json({
            error: "No se pudo actualizar el producto"
        });
    }
});

// Eliminar producto
app.delete("/admin/api/productos/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                error: "Identificador inválido"
            });
        }

        const producto = await Producto.findByIdAndDelete(
            req.params.id
        );

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({
            error: "No se pudo eliminar el producto"
        });
    }
});

// Archivos de la página principal y del administrador
app.use(
    "/admin",
    express.static(path.join(__dirname, "admin.html"))
);

app.use(
    express.static(path.join(__dirname, "public"))
);

// Iniciar MongoDB y el servidor
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

        app.listen(PORT, () => {
            console.log(
                `Servidor ejecutándose en el puerto ${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Error al iniciar servidor:",
            error.message
        );

        process.exitCode = 1;
    }
}

iniciarServidor();
