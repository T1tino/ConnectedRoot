// ConnectedRoot-Mongo-API/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const plantsDashboardRoutes = require('./routes/plantsDashboard');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// ==============================================
// MIDDLEWARES
// ==============================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/plantas/dashboard', plantsDashboardRoutes);

// Configuración CORS específica para React Native
app.use(cors({
  origin: [
    'http://localhost:4000',
    'http://localhost:19006', // Expo web
    'http://localhost:8081',  // Metro bundler
    'exp://localhost:19000',  // Expo client
    '*' // Para desarrollo, en producción especifica dominios
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==============================================
// CONEXIÓN A MONGODB
// ==============================================
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 
                    process.env.MONGO_URL || 
                    'mongodb://localhost:27017/connectedroot';
    
    console.log('🔄 Conectando a MongoDB...');
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    
    // Event listeners para la conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔴 MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });

  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    
    // Información adicional para debugging
    if (error.name === 'MongoServerSelectionError') {
      console.error('💡 Posibles soluciones:');
      console.error('   - Verifica que MongoDB esté ejecutándose');
      console.error('   - Revisa la URI de conexión en .env');
      console.error('   - Verifica conectividad de red');
    }
    
    process.exit(1);
  }
};

// ==============================================
// IMPORTAR RUTAS
// ==============================================
const plantsRouter = require('./routes/plants');

// ==============================================
// RUTAS PRINCIPALES
// ==============================================

// Ruta raíz con información de la API
app.get('/', (req, res) => {
  res.json({
    message: 'ConnectedRoot API - Monitoreo de Plantas IoT 🌱',
    version: '1.0.0',
    status: 'running',
    mongodb: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
    endpoints: {
      plants: '/api/plants',
      health: '/api/health',
      docs: '/api/docs'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: {
      status: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
      host: mongoose.connection.host,
      name: mongoose.connection.name
    },
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  };

  res.status(200).json(healthCheck);
});

// Usar las rutas de plants
app.use('/api/plants', plantsRouter);

// Ruta de compatibilidad para el frontend existente
app.use('/plantas', plantsRouter);

// Endpoint para documentación básica
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'ConnectedRoot API Documentation',
    version: '1.0.0',
    endpoints: [
      {
        method: 'GET',
        path: '/api/plants',
        description: 'Obtener todas las plantas activas'
      },
      {
        method: 'GET',
        path: '/api/plants/:id',
        description: 'Obtener una planta específica por ID'
      },
      {
        method: 'POST',
        path: '/api/plants',
        description: 'Crear una nueva planta'
      },
      {
        method: 'PUT',
        path: '/api/plants/:id',
        description: 'Actualizar una planta'
      },
      {
        method: 'PUT',
        path: '/api/plants/:id/sensor',
        description: 'Actualizar datos del sensor'
      },
      {
        method: 'DELETE',
        path: '/api/plants/:id',
        description: 'Eliminar una planta (soft delete)'
      }
    ]
  });
});

// ==============================================
// MANEJO DE ERRORES
// ==============================================

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/plants',
      'POST /api/plants',
      'GET /api/plants/:id',
      'PUT /api/plants/:id',
      'DELETE /api/plants/:id'
    ]
  });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
  console.error('❌ Error no manejado:', error);
  
  // Error de validación de Mongoose
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      error: 'Error de validación',
      details: errors
    });
  }
  
  // Error de cast de Mongoose (ID inválido)
  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'El ID proporcionado no es válido'
    });
  }
  
  // Duplicate key error
  if (error.code === 11000) {
    return res.status(400).json({
      error: 'Valor duplicado',
      message: 'Ya existe un registro con esos datos'
    });
  }
  
  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal',
    timestamp: new Date().toISOString()
  });
});

// ==============================================
// INICIAR SERVIDOR
// ==============================================
const startServer = async () => {
  try {
    // Conectar a MongoDB primero
    await connectDB();
    
    // Iniciar servidor HTTP
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 Servidor ConnectedRoot iniciado');
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`📱 Red: http://0.0.0.0:${PORT}`);
      console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
      console.log(`📚 Docs: http://localhost:${PORT}/api/docs`);
      console.log(`⚡ Entorno: ${process.env.NODE_ENV || 'development'}`);
    });

    // Manejo de cierre graceful
    const gracefulShutdown = async (signal) => {
      console.log(`\n🔄 Recibida señal ${signal}, cerrando servidor...`);
      
      server.close(async () => {
        console.log('🔒 Servidor HTTP cerrado');
        
        try {
          await mongoose.connection.close();
          console.log('🔒 Conexión MongoDB cerrada');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error cerrando MongoDB:', error);
          process.exit(1);
        }
      });
    };

    // Escuchar señales de terminación
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();

module.exports = app;