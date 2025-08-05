const mongoose = require('mongoose');

const lecturaSchema = new mongoose.Schema({
  sensorId: { type: String, required: true },
  fechaHora: { type: Date, required: true },
  tipo: { type: String, enum: ['temperatura', 'humedad', 'luz'], required: true },
  valor: { type: Number, required: true },
  unidad: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lectura', lecturaSchema, 'Lecturas'); // 👈 nombre de colección exacto
