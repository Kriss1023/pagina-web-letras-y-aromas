const express = require("express");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const PORT = 3000;

// Usuario y clave para entrar al admin (cámbialos)
const ADMIN_USER = process.env.ADMIN_USER || "Kris";
const ADMIN_PASS = process.env.ADMIN_PASS || "1234";
console.log("Usuario del admin:", ADMIN_USER);
console.log("Largo de la clave:", ADMIN_PASS.length);
// ---------- Base de datos ----------
// Se guarda en el archivo tienda.db
const db = new DatabaseSync(path.join(__dirname, "tienda.db"));

// Crea la tabla si todavía no existe
db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT NOT NULL DEFAULT '',
        precio REAL NOT NULL DEFAULT 0,
        categoria TEXT NOT NULL DEFAULT '',
        imagen TEXT NOT NULL DEFAULT '',
        stock INTEGER NOT NULL DEFAULT 0
    )
`);

// ---------- Protección del admin ----------
// Pide usuario y clave antes de entrar a /admin
function protegerAdmin(req, res, next) {
    var header = req.headers.authorization || "";
    var partes = header.split(" ");

    if (partes[0] === "Basic" && partes[1]) {
        var texto = Buffer.from(partes[1], "base64").toString();
        var usuario = texto.split(":")[0];
        var clave = texto.split(":").slice(1).join(":");

        if (usuario === ADMIN_USER && clave === ADMIN_PASS) {
            return next();
        }
    }

    res.set("WWW-Authenticate", 'Basic realm="Admin"');
    res.status(401).send("Acceso restringido");
}

// Revisa que los datos del formulario estén bien
function revisarProducto(body) {
    var nombre = String(body.nombre || "").trim();
    var precio = Number(body.precio);
    var stock = Number(body.stock);

    if (nombre === "") {
        return { error: "El nombre es obligatorio" };
    }
    if (isNaN(precio) || precio < 0) {
        return { error: "Precio inválido" };
    }
    if (!Number.isInteger(stock) || stock < 0) {
        return { error: "Stock inválido" };
    }

    return {
        datos: {
            nombre: nombre,
            descripcion: String(body.descripcion || "").trim(),
            precio: precio,
            categoria: String(body.categoria || "").trim(),
            imagen: String(body.imagen || "").trim(),
            stock: stock
        }
    };
}

// Para poder leer el JSON que envía el formulario
app.use(express.json());

// ---------- API pública (la usa la página principal) ----------
// Solo muestra los productos que tienen stock
app.get("/api/productos", function (req, res) {
    var productos = db
        .prepare("SELECT * FROM productos WHERE stock > 0 ORDER BY nombre")
        .all();
    res.json(productos);
});

// ---------- API del admin (con clave) ----------
app.use("/admin", protegerAdmin);

// Ver todos los productos
app.get("/admin/api/productos", function (req, res) {
    var productos = db.prepare("SELECT * FROM productos ORDER BY id DESC").all();
    res.json(productos);
});

// Agregar un producto
app.post("/admin/api/productos", function (req, res) {
    var resultado = revisarProducto(req.body);
    if (resultado.error) {
        return res.status(400).json({ error: resultado.error });
    }

    var d = resultado.datos;
    var info = db
        .prepare(
            "INSERT INTO productos (nombre, descripcion, precio, categoria, imagen, stock) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .run(d.nombre, d.descripcion, d.precio, d.categoria, d.imagen, d.stock);

    res.status(201).json({ id: Number(info.lastInsertRowid), ...d });
});

// Editar un producto
app.put("/admin/api/productos/:id", function (req, res) {
    var id = Number(req.params.id);
    var resultado = revisarProducto(req.body);
    if (resultado.error) {
        return res.status(400).json({ error: resultado.error });
    }

    var d = resultado.datos;
    var info = db
        .prepare(
            "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, imagen = ?, stock = ? WHERE id = ?"
        )
        .run(d.nombre, d.descripcion, d.precio, d.categoria, d.imagen, d.stock, id);

    if (info.changes === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ id: id, ...d });
});

// Borrar un producto
app.delete("/admin/api/productos/:id", function (req, res) {
    var id = Number(req.params.id);
    var info = db.prepare("DELETE FROM productos WHERE id = ?").run(id);

    if (info.changes === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ ok: true });
});

// ---------- Páginas ----------
// La carpeta "admin" tiene el panel y la carpeta "public" la página principal
app.use("/admin", express.static(path.join(__dirname, "admin")));
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, function () {
    console.log("Servidor ejecutándose en http://localhost:" + PORT);
});
