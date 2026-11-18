
const express = require("express");
const router = express.Router();

const Suscriptor = require("../models/suscriptor.js");

// Registrar suscripciones en MongoDB
router.post("/", async (req, res) => {
    const { correo, consentimiento } = req.body || {};

    if (
        typeof correo !== "string" ||
        consentimiento !== true
    ) {
        return res.status(400).json({
            mensaje: "Ingresa tu correo y acepta recibir novedades."
        });
    }

    const correoLimpio = correo.trim().toLowerCase();

    const correoValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio);

    if (!correoValido || correoLimpio.length > 254) {
        return res.status(400).json({
            mensaje: "El correo electrónico no es válido."
        });
    }

    try {
        await Suscriptor.create({
            correo: correoLimpio,
            consentimiento: true,
            confirmado: false
        });

        return res.status(201).json({
            mensaje: "Tu solicitud de suscripción fue registrada correctamente."
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({
                mensaje: "Este correo ya tiene una solicitud registrada."
            });
        }

        console.error("Error de suscripción:", error.message);

        return res.status(500).json({
            mensaje: "No se pudo registrar la suscripción."
        });
    }
});

module.exports = router;
