//ConnectedRoot-Mongo-API/models/Plant.js
const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  scientific_name: String,
  image_url: String,
  family_common_name: String,
  genus: String,
  year: Number,
  bibliography: String,
  author: String,
  observations: String,
  vegetable: Boolean,
  edible: Boolean,
  edible_part: [String],
  duration: String,
  native_status: String
}, {
  collection: 'Plants' // 👈 aquí le indicas el nombre exacto
});

const Plant = mongoose.model('Plants', PlantSchema);

module.exports = Plant;
