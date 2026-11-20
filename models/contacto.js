
const mongoose = require("mongoose");

const contactoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    asunto: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },

    mensaje: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Contacto", contactoSchema);
