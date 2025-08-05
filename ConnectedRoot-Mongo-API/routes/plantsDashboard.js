// ConnectedRoot-Mongo-API/routes/plantsDashboard.js
const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const Lectura = require('../models/Lectura');

// GET /api/plantas/dashboard
router.get('/', async (req, res) => {
  try {
    const plantas = await Plant.find({ isActive: true });

    const resultado = await Promise.all(
      plantas.map(async (planta) => {
        const lecturas = await Lectura.aggregate([
          { $match: { sensorId: planta._id.toString() } },
          { $sort: { fechaHora: -1 } },
          {
            $group: {
              _id: "$tipo",
              valor: { $first: "$valor" },
              fecha: { $first: "$fechaHora" },
              unidad: { $first: "$unidad" }
            }
          }
        ]);

        const datos = {
          temperatura: lecturas.find(l => l._id === "temperatura")?.valor,
          humedad: lecturas.find(l => l._id === "humedad")?.valor,
          luz: lecturas.find(l => l._id === "luz")?.valor
        };

        return {
          _id: planta._id,
          nombreComun: planta.nombreComun,
          nombreCientifico: planta.nombreCientifico,
          image: planta.image,
          temperatura: planta.temperatura,
          humedad: planta.humedad,
          cuidadosExtra: planta.cuidadosExtra,
          lecturas: datos
        };
      })
    );

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener datos del dashboard' });
  }
});

module.exports = router;
