
require("dotenv").config();

const mongoose = require("mongoose");
const Producto = require("./models/Producto");

// Productos de Letras & Aromas
const productos = [
    {
        tipo: "libros",
        categoria: "NOVELA",
        nombre: "Entre páginas",
        precio: 18,
        imagen: "amor entre paginas.jfif",
        descripcion: "Una historia llena de emociones, encuentros y nuevos comienzos.",
        stock: 10
    },
    {
        tipo: "libros",
        categoria: "ROMANCE",
        nombre: "Cartas de otoño",
        precio: 20,
        imagen: "cartas de otono.jfif",
        descripcion: "Una historia romántica para leer acompañada de una taza de café.",
        stock: 10
    },
    {
        tipo: "libros",
        categoria: "FANTASÍA",
        nombre: "El jardín secreto",
        precio: 22,
        imagen: "-el-jardin-secreto.jpg",
        descripcion: "Una aventura mágica donde todo puede hacerse realidad.",
        stock: 10
    },
    {
        tipo: "libros",
        categoria: "NOVELA",
        nombre: "Orgullo y prejuicio",
        precio: 22,
        imagen: "orgullo y prejuicio.jpg",
        descripcion: "Elizabeth Bennet y Fitzwilliam Darcy deben superar sus prejuicios para estar juntos.",
        stock: 10
    },
    {
        tipo: "libros",
        categoria: "NOVELA",
        nombre: "En agosto nos vemos",
        precio: 15,
        imagen: "en agosto nos vemos.webp",
        descripcion: "Novela póstuma de Gabriel García Márquez, publicada en marzo de 2024.",
        stock: 10
    },
    {
        tipo: "libros",
        categoria: "NOVELA CORTA",
        nombre: "La metamorfosis",
        precio: 9,
        imagen: "la metamorfosis.jpg",
        descripcion: "Una historia sobre la deshumanización y el aislamiento.",
        stock: 8
    },
    {
        tipo: "velas",
        categoria: "RELAX",
        nombre: "Vela de lavanda",
        precio: 12,
        imagen: "vela-lavanda.jfif",
        descripcion: "Aroma floral y relajante para crear un espacio tranquilo.",
        stock: 15
    },
    {
        tipo: "velas",
        categoria: "DULCE",
        nombre: "Vela de vainilla",
        precio: 13,
        imagen: "vela-vainilla.jfif",
        descripcion: "Un aroma cálido, dulce y acogedor.",
        stock: 15
    },
    {
        tipo: "velas",
        categoria: "FLORAL",
        nombre: "Pétalos de rosa",
        precio: 15,
        imagen: "vela-rosas.jfif",
        descripcion: "Una fragancia romántica y delicada.",
        stock: 15
    },
    {
        tipo: "velas",
        categoria: "CÁLIDO",
        nombre: "Vela de chocolate",
        precio: 14,
        imagen: "vela-chocolate.jfif",
        descripcion: "Perfecta para crear un ambiente cálido y acogedor.",
        stock: 15
    }
];

// Conectar y registrar productos
async function cargarProductos() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("Falta MONGODB_URI en el archivo .env");
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB conectado correctamente");

        let creados = 0;
        let actualizados = 0;

        for (const producto of productos) {
            const resultado = await Producto.updateOne(
                {
                    nombre: producto.nombre,
                    tipo: producto.tipo
                },
                {
                    $set: producto
                },
                {
                    upsert: true
                }
            );

            if (resultado.upsertedCount > 0) {
                creados++;
            } else {
                actualizados++;
            }
        }

        console.log("Productos procesados correctamente");
        console.log(`Productos nuevos: ${creados}`);
        console.log(`Productos actualizados: ${actualizados}`);

        const total = await Producto.countDocuments();

        console.log(`Total de productos en MongoDB: ${total}`);

    } catch (error) {
        console.error("Error al guardar productos:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log("Conexión con MongoDB cerrada");
    }
}

cargarProductos();
