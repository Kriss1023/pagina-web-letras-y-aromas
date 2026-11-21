require("dotenv").config();

const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = new sqlite3.Database(
    path.join(__dirname, "tienda.db"),
    (err) => {
        if (err) {
            console.error("Error connecting to database:", err.message);
        } else {
            console.log("Connected to SQLite database: tienda.db");
        }
    }
);

// Initialize database tables
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS productos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    tipo TEXT NOT NULL,
                    categoria TEXT,
                    precio REAL NOT NULL,
                    stock INTEGER DEFAULT 0,
                    imagen TEXT DEFAULT "",
                    descripcion TEXT DEFAULT ""
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS contacto (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    email TEXT NOT NULL,
                    asunto TEXT NOT NULL,
                    mensaje TEXT NOT NULL,
                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS suscripciones (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    correo TEXT NOT NULL UNIQUE,
                    consentimiento BOOLEAN DEFAULT 1,
                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Insert sample products if table is empty
            db.get("SELECT COUNT(*) as count FROM productos", [], (err, row) => {
                if (row.count === 0) {
                    const sampleProducts = [
                        ["Orgullo y prejuicio", "libros", "NOVELA", 22.00, 10, "-el-jardin-secreto.jpg", "Clásica historia de Elizabeth Bennet y Fitzwilliam Darcy"],
                        ["En Agosto Nos Vemos", "libros", "NOVELA", 15.00, 5, "en agosto nos vemos.webp", "Novela póstuma de Gabriel García Márquez"],
                        ["El Jardín Secreto", "libros", "FANTASÍA", 22.00, 8, "-el-jardin-secreto.jpg", "Una aventura mágica donde todo puede hacerse realidad"],
                        ["Vela de Lavanda", "velas", "RELAX", 12.00, 20, "vela-lavanda.jfif", "Aroma floral y relajante para crear un espacio tranquilo"],
                        ["Vela de Vainilla", "velas", "DULCE", 13.00, 30, "vela-vainilla.jfif", "Un aroma cálido, dulce y acogedor"],
                        ["Vela de Rosas", "velas", "FLORAL", 15.00, 25, "vela-rosas.jfif", "Una fragancia romántica y delicada"],
                        ["Vela de Chocolate", "velas", "CÁLIDO", 14.00, 18, "vela-chocolate.jfif", "Perfecta para crear un ambiente cálido y acogedor"],
                        ["Entre páginas", "libros", "NOVELA", 18.00, 12, "amor entre paginas.jfif", "Una historia llena de emociones, encuentros y nuevos comienzos"],
                        ["Cartas de Otoño", "libros", "ROMANCE", 20.00, 15, "cartas de otono.jfif", "Una historia romántica para leer acompañada de una taza de café"],
                        ["La Metamorfosis", "libros", "NOVELA CORTA", 9.00, 30, "la metamorfosis.jpg", "Explica la deshumanización del ser humano y la cruel mercantilización de las personas en la sociedad moderna"]
                    ];

                    const stmt = db.prepare("INSERT INTO productos (nombre, tipo, categoria, precio, stock, imagen, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    sampleProducts.forEach(producto => {
                        stmt.run(producto);
                    });
                    stmt.finalize();
                    console.log("Productos de muestra insertados");
                }
            });
        });
        resolve();
    });
}

initializeDatabase().then(() => {
    console.log("Base de datos inicializada");
});

// API pública: productos
app.get("/api/productos", (req, res) => {
    const tipo = req.query.tipo;

    let query = "SELECT id, nombre, tipo, categoria, precio, stock, imagen, descripcion FROM productos";
    const params = [];

    if (tipo && tipo !== "todos") {
        query += " WHERE tipo = ?";
        params.push(tipo);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Error al consultar productos:", err.message);
            res.status(500).json({ mensaje: "Error al obtener los productos" });
            return;
        }
        res.json(rows);
    });
});

// API: contacto
app.post("/api/contacto", (req, res) => {
    const { nombre, email, asunto, mensaje } = req.body;

    if (!nombre || !email || !asunto || !mensaje) {
        return res.status(400).json({ mensaje: "Completa todos los campos" });
    }

    const sql = "INSERT INTO contacto (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)";
    db.run(sql, [nombre, email, asunto, mensaje], function(err) {
        if (err) {
            console.error("Error al guardar contacto:", err.message);
            res.status(500).json({ mensaje: "No se pudo guardar el mensaje" });
            return;
        }
        res.json({ mensaje: "Mensaje guardado correctamente", id: this.lastID });
    });
});

// API: suscripciones
app.post("/api/suscripciones", (req, res) => {
    const { correo } = req.body;

    if (!correo) {
        return res.status(400).json({ mensaje: "Correo electrónico requerido" });
    }

    const sql = "INSERT INTO suscripciones (correo, consentimiento) VALUES (?, 1)";
    db.run(sql, [correo], function(err) {
        if (err) {
            // Correo duplicado
            if (err.message && err.message.includes("UNIQUE constraint failed")) {
                res.status(409).json({ mensaje: "Este correo ya está suscrito" });
            } else {
                console.error("Error al suscribir:", err.message);
                res.status(500).json({ mensaje: "No se pudo registrar la suscripción" });
            }
            return;
        }
        res.json({ mensaje: "Suscripción exitosa", id: this.lastID });
    });
});

// Servir archivos estáticos del público
app.use(express.static(path.join(__dirname, "../public")));

// Panel administrativo (simplificado sin auth Basic para el frontend React)
app.get("/admin/api/productos", (req, res) => {
    db.all("SELECT id, nombre, tipo, categoria, precio, stock, imagen, descripcion FROM productos ORDER BY created_en DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: "No se pudieron consultar los productos" });
            return;
        }
        res.json(rows);
    });
});

app.post("/admin/api/productos", (req, res) => {
    const { nombre, tipo, categoria, precio, stock, imagen, descripcion } = req.body;

    if (!nombre || !tipo || !precio) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    const sql = `INSERT INTO productos (nombre, tipo, categoria, precio, stock, imagen, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [nombre, tipo, categoria || "", Number(precio), Number(stock) || 0, imagen || "", descripcion || ""], function(err) {
        if (err) {
            res.status(500).json({ error: "No se pudo crear el producto" });
            return;
        }
        res.status(201).json({ ok: true, id: this.lastID });
    });
});

app.put("/admin/api/productos/:id", (req, res) => {
    const id = req.params.id;
    const { nombre, tipo, categoria, precio, stock, imagen, descripcion } = req.body;

    const sql = `UPDATE productos SET nombre = ?, tipo = ?, categoria = ?, precio = ?, stock = ?, imagen = ?, descripcion = ? WHERE id = ?`;
    db.run(sql, [nombre, tipo, categoria || "", Number(precio), Number(stock) || 0, imagen || "", descripcion || "", id], function(err) {
        if (err) {
            res.status(500).json({ error: "No se pudo actualizar el producto" });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }
        res.json({ ok: true });
    });
});

app.delete("/admin/api/productos/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM productos WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: "No se pudo eliminar el producto" });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }
        res.json({ ok: true });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor backend ejecutándose en el puerto ${PORT}`);
});

module.exports = { app, db };