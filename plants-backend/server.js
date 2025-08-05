// server.js - Backend Express para conectar con MongoDB
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://0323105932:0323105932@rootdb.mnmbdoa.mongodb.net/RootDB';
let db;

MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('✅ Conectado a MongoDB');
    db = client.db('RootDB');
  })
  .catch(error => {
    console.error('❌ Error conectando a MongoDB:', error);
  });

// ROUTES PARA PLANTS
app.get('/api/plants', async (req, res) => {
  try {
    const plants = await db.collection('Plants').find({}).toArray();
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/plants/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const plant = await db.collection('Plants').findOne({ _id: new ObjectId(req.params.id) });
    if (!plant) {
      return res.status(404).json({ error: 'Planta no encontrada' });
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/plants/search', async (req, res) => {
  try {
    const { q } = req.query;
    const plants = await db.collection('Plants').find({
      $or: [
        { nombreComun: { $regex: q, $options: 'i' } },
        { nombreCientifico: { $regex: q, $options: 'i' } }
      ]
    }).toArray();
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTES PARA PLANTAS SUPERVISADAS
app.get('/api/plantas-supervisadas', async (req, res) => {
  try {
    const plantas = await db.collection('PlantasSupervisadas').find({}).toArray();
    res.json(plantas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/plantas-supervisadas', async (req, res) => {
  try {
    const plantaData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('PlantasSupervisadas').insertOne(plantaData);
    const newPlanta = await db.collection('PlantasSupervisadas').findOne({ _id: result.insertedId });
    res.status(201).json(newPlanta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/plantas-supervisadas/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    const result = await db.collection('PlantasSupervisadas').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).json({ error: 'Planta supervisada no encontrada' });
    }
    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/plantas-supervisadas/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const result = await db.collection('PlantasSupervisadas').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Planta supervisada no encontrada' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTES PARA LECTURAS
app.get('/api/lecturas/planta/:plantaId', async (req, res) => {
  try {
    const lecturas = await db.collection('Lecturas').find({ 
      plantaSupervisadaId: req.params.plantaId 
    }).sort({ timestamp: -1 }).toArray();
    res.json(lecturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/lecturas', async (req, res) => {
  try {
    const lecturaData = {
      ...req.body,
      timestamp: new Date(req.body.timestamp) || new Date()
    };
    const result = await db.collection('Lecturas').insertOne(lecturaData);
    const newLectura = await db.collection('Lecturas').findOne({ _id: result.insertedId });
    res.status(201).json(newLectura);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

app.use(cors({
  origin: '*',  // En desarrollo
  credentials: true
}));

// package.json para el backend
/*
{
  "name": "plants-api",
  "version": "1.0.0",
  "description": "API para gestión de plantas",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongodb": "^6.3.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
*/