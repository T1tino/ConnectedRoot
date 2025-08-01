const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');

// GET /api/plants
router.get('/', async (req, res) => {
    try {
        const plants = await Plant.find();
        res.json(plants);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener plantas' });
    }
});

// POST /api/plants
router.post('/', async (req, res) => {
    try {
        const plant = new Plant(req.body);
        await plant.save();
        res.status(201).json(plant);
    } catch (err) {
        res.status(400).json({ error: 'Error al crear planta' });
    }
});

module.exports = router;
