const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    name: String,
    species: String,
    humidity: Number,
    temperature: Number,
    lastWatered: Date,
    image: String,
});

module.exports = mongoose.model('Plant', PlantSchema);
