
const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },

    tipo: {
        type: String,
        required: true,
        enum: ["libros", "velas"]
    },

    categoria: {
        type: String,
        required: true
    },

    precio: {
        type: Number,
        required: true,
        min: 0
    },

    descripcion: {
        type: String,
        default: ""
    },

    imagen: {
        type: String,
        default: ""
    },

    stock: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Producto", productoSchema);
