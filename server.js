const express = require("express");
const path = require("path");

const app = express();

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "cambia-esta-clave";

// Pide usuario y contraseña antes de mostrar el admin
function protegerAdmin(req, res, next) {
    const header = req.headers.authorization || "";
    const [tipo, credenciales] = header.split(" ");

    if (tipo === "Basic" && credenciales) {
        const [usuario, ...resto] = Buffer.from(credenciales, "base64")
            .toString()
            .split(":");
        const clave = resto.join(":");
        if (usuario === ADMIN_USER && clave === ADMIN_PASS) {
            return next();
        }
    }

    res.set("WWW-Authenticate", 'Basic realm="Admin"');
    res.status(401).send("Acceso restringido");
}

// El admin va primero, con protección
app.use("/admin", protegerAdmin, express.static(path.join(__dirname, "admin")));

// La página pública
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});