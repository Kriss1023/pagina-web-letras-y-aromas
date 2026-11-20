
const mongoose = require("mongoose");

const suscriptorSchema = new mongoose.Schema({
    correo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 254
    },

    consentimiento: {
        type: Boolean,
        required: true
    },

    fechaConsentimiento: {
        type: Date,
        default: Date.now
    },

    confirmado: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
    collection: "suscriptores"
});

module.exports = mongoose.model(
    "Suscriptor",
    suscriptorSchema
);
