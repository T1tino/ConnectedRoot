// ConnectedRoot-Mongo-API/models/Plant.js
const mongoose = require('mongoose');

// Schema para datos del sensor
const sensorDataSchema = new mongoose.Schema({
  temperaturaActual: {
    type: Number,
    min: [-50, 'La temperatura no puede ser menor a -50°C'],
    max: [60, 'La temperatura no puede ser mayor a 60°C']
  },
  humedadActual: {
    type: Number,
    min: [0, 'La humedad no puede ser menor a 0%'],
    max: [100, 'La humedad no puede ser mayor a 100%']
  },
  luzActual: {
    type: Number,
    min: [0, 'La luz no puede ser menor a 0 lux'],
    max: [100000, 'La luz no puede ser mayor a 100,000 lux']
  },
  ultimaLectura: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Schema para rangos de temperatura óptima
const temperaturaSchema = new mongoose.Schema({
  min: {
    type: Number,
    required: [true, 'La temperatura mínima es requerida'],
    min: [-10, 'La temperatura mínima no puede ser menor a -10°C'],
    max: [50, 'La temperatura mínima no puede ser mayor a 50°C']
  },
  max: {
    type: Number,
    required: [true, 'La temperatura máxima es requerida'],
    min: [-10, 'La temperatura máxima no puede ser menor a -10°C'],
    max: [60, 'La temperatura máxima no puede ser mayor a 60°C']
  }
}, { _id: false });

// Validación para asegurar que min < max
temperaturaSchema.pre('validate', function() {
  if (this.min >= this.max) {
    this.invalidate('max', 'La temperatura máxima debe ser mayor que la mínima');
  }
});

// Schema principal de la planta
const plantSchema = new mongoose.Schema({
  nombreComun: {
    type: String,
    required: [true, 'El nombre común es requerido'],
    trim: true,
    maxlength: [100, 'El nombre común no puede exceder 100 caracteres'],
    minlength: [2, 'El nombre común debe tener al menos 2 caracteres']
  },
  nombreCientifico: {
    type: String,
    trim: true,
    maxlength: [150, 'El nombre científico no puede exceder 150 caracteres'],
    validate: {
      validator: function(v) {
        // Validación básica para nombre científico (Género especie)
        return !v || /^[A-Z][a-z]+ [a-z]+/.test(v);
      },
      message: 'El nombre científico debe seguir el formato "Género especie"'
    }
  },
  temperatura: {
    type: temperaturaSchema,
    validate: {
      validator: function(v) {
        return !v || (v.min < v.max);
      },
      message: 'La temperatura mínima debe ser menor que la máxima'
    }
  },
  humedad: {
    type: String,
    trim: true,
    maxlength: [50, 'La descripción de humedad no puede exceder 50 caracteres'],
    validate: {
      validator: function(v) {
        // Permitir formatos como "60-70%", "Alta", "Moderada", etc.
        return !v || /^(\d{1,3}(-\d{1,3})?%?|[A-Za-z\s]+)$/.test(v);
      },
      message: 'Formato de humedad inválido. Use "60-70%" o descripciones como "Alta"'
    }
  },
  iluminacion: {
    type: String,
    trim: true,
    maxlength: [100, 'La descripción de iluminación no puede exceder 100 caracteres'],
    enum: {
      values: [
        'Luz directa', 
        'Luz indirecta', 
        'Luz indirecta brillante', 
        'Luz baja', 
        'Sombra',
        'Sol pleno',
        'Semisombra'
      ],
      message: 'Tipo de iluminación no válido'
    }
  },
  cuidadosExtra: {
    type: String,
    trim: true,
    maxlength: [500, 'Los cuidados extra no pueden exceder 500 caracteres']
  },
  image: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Validar URL básica si se proporciona
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'La URL de la imagen debe ser válida (http:// o https://)'
    }
  },
  // Datos del sensor IoT
  sensorData: {
    type: sensorDataSchema,
    default: () => ({})
  },
  // Control de estado
  isActive: {
    type: Boolean,
    default: true
  },
  // Metadatos adicionales
  categoria: {
    type: String,
    enum: ['Interior', 'Exterior', 'Suculenta', 'Tropical', 'Medicinal', 'Ornamental'],
    default: 'Interior'
  },
  dificultadCuidado: {
    type: String,
    enum: ['Fácil', 'Intermedio', 'Difícil'],
    default: 'Intermedio'
  },
  // Información del usuario (si implementas autenticación)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // Coordenadas GPS si la planta está en exterior
  ubicacion: {
    latitud: {
      type: Number,
      min: [-90, 'Latitud inválida'],
      max: [90, 'Latitud inválida']
    },
    longitud: {
      type: Number,
      min: [-180, 'Longitud inválida'],
      max: [180, 'Longitud inválida']
    }
  },
  // Tags para búsqueda y filtrado
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Cada tag no puede exceder 30 caracteres']
  }],
  // Notas del usuario
  notas: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Personalizar la salida JSON
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// ==============================================
// ÍNDICES PARA OPTIMIZAR CONSULTAS
// ==============================================
plantSchema.index({ nombreComun: 1 });
plantSchema.index({ nombreCientifico: 1 });
plantSchema.index({ isActive: 1 });
plantSchema.index({ categoria: 1 });
plantSchema.index({ createdAt: -1 });
plantSchema.index({ owner: 1 });
plantSchema.index({ tags: 1 });

// Índice de texto para búsqueda
plantSchema.index({ 
  nombreComun: 'text', 
  nombreCientifico: 'text', 
  cuidadosExtra: 'text',
  tags: 'text'
});

// Índice geoespacial para ubicación
plantSchema.index({ 
  "ubicacion.latitud": 1, 
  "ubicacion.longitud": 1 
});

// ==============================================
// MIDDLEWARES (HOOKS)
// ==============================================

// Pre-save middleware
plantSchema.pre('save', function(next) {
  // Capitalizar primera letra del nombre común
  if (this.nombreComun) {
    this.nombreComun = this.nombreComun.charAt(0).toUpperCase() + 
                       this.nombreComun.slice(1).toLowerCase();
  }
  
  // Formatear nombre científico
  if (this.nombreCientifico) {
    const parts = this.nombreCientifico.trim().split(' ');
    if (parts.length >= 2) {
      this.nombreCientifico = parts[0].charAt(0).toUpperCase() + 
                              parts[0].slice(1).toLowerCase() + ' ' +
                              parts[1].toLowerCase();
    }
  }
  
  // Limpiar tags duplicados y vacíos
  if (this.tags && this.tags.length > 0) {
    this.tags = [...new Set(this.tags.filter(tag => tag.trim().length > 0))];
  }
  
  next();
});

// Pre-update middleware
plantSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// ==============================================
// MÉTODOS DE INSTANCIA
// ==============================================

// Verificar si la planta necesita riego
plantSchema.methods.necesitaRiego = function() {
  if (!this.sensorData.humedadActual) return null;
  
  // Lógica básica: si la humedad actual es menor al 30%, necesita riego
  return this.sensorData.humedadActual < 30;
};

// Verificar si la temperatura está en rango óptimo
plantSchema.methods.temperaturaEnRango = function() {
  if (!this.temperatura || !this.sensorData.temperaturaActual) return null;
  
  return this.sensorData.temperaturaActual >= this.temperatura.min && 
         this.sensorData.temperaturaActual <= this.temperatura.max;
};

// Obtener estado general de salud de la planta
plantSchema.methods.getEstadoSalud = function() {
  const alertas = [];
  
  // Verificar temperatura
  if (this.temperatura && this.sensorData.temperaturaActual) {
    if (!this.temperaturaEnRango()) {
      alertas.push({
        tipo: 'temperatura',
        mensaje: `Temperatura fuera de rango (${this.sensorData.temperaturaActual}°C)`,
        nivel: 'warning'
      });
    }
  }
  
  // Verificar humedad
  if (this.necesitaRiego()) {
    alertas.push({
      tipo: 'humedad',
      mensaje: `Humedad baja (${this.sensorData.humedadActual}%)`,
      nivel: 'warning'
    });
  }
  
  // Verificar última lectura del sensor
  if (this.sensorData.ultimaLectura) {
    const horasDesdeUltimaLectura = (Date.now() - this.sensorData.ultimaLectura) / (1000 * 60 * 60);
    if (horasDesdeUltimaLectura > 24) {
      alertas.push({
        tipo: 'conectividad',
        mensaje: 'Sin lecturas del sensor por más de 24 horas',
        nivel: 'error'
      });
    }
  }
  
  return {
    estado: alertas.length === 0 ? 'saludable' : 'necesita_atencion',
    alertas: alertas,
    ultimaRevision: new Date()
  };
};

// Actualizar datos del sensor con validación
plantSchema.methods.actualizarSensor = function(datos) {
  if (!this.sensorData) {
    this.sensorData = {};
  }
  
  if (datos.temperaturaActual !== undefined) {
    this.sensorData.temperaturaActual = datos.temperaturaActual;
  }
  
  if (datos.humedadActual !== undefined) {
    this.sensorData.humedadActual = datos.humedadActual;
  }
  
  if (datos.luzActual !== undefined) {
    this.sensorData.luzActual = datos.luzActual;
  }
  
  this.sensorData.ultimaLectura = new Date();
  
  return this.save();
};

// ==============================================
// MÉTODOS ESTÁTICOS
// ==============================================

// Buscar plantas por nombre (común o científico)
plantSchema.statics.buscarPorNombre = function(nombre) {
  return this.find({
    $or: [
      { nombreComun: { $regex: nombre, $options: 'i' } },
      { nombreCientifico: { $regex: nombre, $options: 'i' } }
    ],
    isActive: { $ne: false }
  });
};

// Obtener plantas activas
plantSchema.statics.obtenerActivas = function() {
  return this.find({ isActive: { $ne: false } }).sort({ createdAt: -1 });
};

// Obtener plantas por categoría
plantSchema.statics.obtenerPorCategoria = function(categoria) {
  return this.find({ 
    categoria: categoria, 
    isActive: { $ne: false } 
  }).sort({ nombreComun: 1 });
};

// Obtener plantas que necesitan atención
plantSchema.statics.obtenerQueNecesitanAtencion = function() {
  const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  return this.find({
    $or: [
      { 'sensorData.humedadActual': { $lt: 30 } },
      { 'sensorData.ultimaLectura': { $lt: hace24Horas } },
      { 'sensorData.ultimaLectura': { $exists: false } }
    ],
    isActive: { $ne: false }
  });
};

// Estadísticas generales
plantSchema.statics.obtenerEstadisticas = function() {
  return this.aggregate([
    {
      $match: { isActive: { $ne: false } }
    },
    {
      $group: {
        _id: null,
        totalPlantas: { $sum: 1 },
        temperaturaPromedio: { $avg: '$sensorData.temperaturaActual' },
        humedadPromedio: { $avg: '$sensorData.humedadActual' },
        luzPromedio: { $avg: '$sensorData.luzActual' },
        plantasPorCategoria: {
          $push: {
            categoria: '$categoria',
            nombre: '$nombreComun'
          }
        }
      }
    }
  ]);
};

// ==============================================
// CAMPOS VIRTUALES
// ==============================================

// Campo virtual para URL de imagen por defecto
plantSchema.virtual('imagenUrl').get(function() {
  if (this.image) {
    return this.image;
  }
  
  // Generar imagen por defecto basada en el nombre
  const nombre = encodeURIComponent(this.nombreComun || 'Planta');
  return `https://ui-avatars.com/api/?name=${nombre}&background=4ade80&color=ffffff&size=200`;
});

// Campo virtual para días desde la creación
plantSchema.virtual('diasDesdeCreacion').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Campo virtual para el estado de conectividad del sensor
plantSchema.virtual('sensorConectado').get(function() {
  if (!this.sensorData.ultimaLectura) return false;
  
  const horasDesdeUltimaLectura = (Date.now() - this.sensorData.ultimaLectura) / (1000 * 60 * 60);
  return horasDesdeUltimaLectura <= 2; // Consideramos conectado si hay lecturas en las últimas 2 horas
});

// ==============================================
// VALIDACIONES PERSONALIZADAS
// ==============================================

// Validar que la temperatura mínima sea menor que la máxima
plantSchema.path('temperatura').validate(function(temperatura) {
  if (!temperatura) return true;
  return temperatura.min < temperatura.max;
}, 'La temperatura mínima debe ser menor que la máxima');

// Validar que no haya nombres duplicados (case insensitive)
plantSchema.path('nombreComun').validate(async function(nombreComun) {
  const count = await mongoose.models.Plant.countDocuments({
    nombreComun: { $regex: new RegExp(`^${nombreComun}// ConnectedRoot-Mongo-API/models/Plant.js
const mongoose = require('mongoose');

// Schema para datos del sensor
const sensorDataSchema = new mongoose.Schema({
  temperaturaActual: {
    type: Number,
    min: [-50, 'La temperatura no puede ser menor a -50°C'],
    max: [60, 'La temperatura no puede ser mayor a 60°C']
  },
  humedadActual: {
    type: Number,
    min: [0, 'La humedad no puede ser menor a 0%'],
    max: [100, 'La humedad no puede ser mayor a 100%']
  },
  luzActual: {
    type: Number,
    min: [0, 'La luz no puede ser menor a 0 lux'],
    max: [100000, 'La luz no puede ser mayor a 100,000 lux']
  },
  ultimaLectura: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Schema para rangos de temperatura óptima
const temperaturaSchema = new mongoose.Schema({
  min: {
    type: Number,
    required: [true, 'La temperatura mínima es requerida'],
    min: [-10, 'La temperatura mínima no puede ser menor a -10°C'],
    max: [50, 'La temperatura mínima no puede ser mayor a 50°C']
  },
  max: {
    type: Number,
    required: [true, 'La temperatura máxima es requerida'],
    min: [-10, 'La temperatura máxima no puede ser menor a -10°C'],
    max: [60, 'La temperatura máxima no puede ser mayor a 60°C']
  }
}, { _id: false });

// Validación para asegurar que min < max
temperaturaSchema.pre('validate', function() {
  if (this.min >= this.max) {
    this.invalidate('max', 'La temperatura máxima debe ser mayor que la mínima');
  }
});

// Schema principal de la planta
const plantSchema = new mongoose.Schema({
  nombreComun: {
    type: String,
    required: [true, 'El nombre común es requerido'],
    trim: true,
    maxlength: [100, 'El nombre común no puede exceder 100 caracteres'],
    minlength: [2, 'El nombre común debe tener al menos 2 caracteres']
  },
  nombreCientifico: {
    type: String,
    trim: true,
    maxlength: [150, 'El nombre científico no puede exceder 150 caracteres'],
    validate: {
      validator: function(v) {
        // Validación básica para nombre científico (Género especie)
        return !v || /^[A-Z][a-z]+ [a-z]+/.test(v);
      },
      message: 'El nombre científico debe seguir el formato "Género especie"'
    }
  },
  temperatura: {
    type: temperaturaSchema,
    validate: {
      validator: function(v) {
        return !v || (v.min < v.max);
      },
      message: 'La temperatura mínima debe ser menor que la máxima'
    }
  },
  humedad: {
    type: String,
    trim: true,
    maxlength: [50, 'La descripción de humedad no puede exceder 50 caracteres'],
    validate: {
      validator: function(v) {
        // Permitir formatos como "60-70%", "Alta", "Moderada", etc.
        return !v || /^(\d{1,3}(-\d{1,3})?%?|[A-Za-z\s]+)$/.test(v);
      },
      message: 'Formato de humedad inválido. Use "60-70%" o descripciones como "Alta"'
    }
  },
  iluminacion: {
    type: String,
    trim: true,
    maxlength: [100, 'La descripción de iluminación no puede exceder 100 caracteres'],
    enum: {
      values: [
        'Luz directa', 
        'Luz indirecta', 
        'Luz indirecta brillante', 
        'Luz baja', 
        'Sombra',
        'Sol pleno',
        'Semisombra'
      ],
      message: 'Tipo de iluminación no válido'
    }
  },
  cuidadosExtra: {
    type: String,
    trim: true,
    maxlength: [500, 'Los cuidados extra no pueden exceder 500 caracteres']
  },
  image: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Validar URL básica si se proporciona
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'La URL de la imagen debe ser válida (http:// o https://)'
    }
  },
  // Datos del sensor IoT
  sensorData: {
    type: sensorDataSchema,
    default: () => ({})
  },
  // Control de estado
  isActive: {
    type: Boolean,
    default: true
  },
  // Metadatos adicionales
  categoria: {
    type: String,
    enum: ['Interior', 'Exterior', 'Suculenta', 'Tropical', 'Medicinal', 'Ornamental'],
    default: 'Interior'
  },
  dificultadCuidado: {
    type: String,
    enum: ['Fácil', 'Intermedio', 'Difícil'],
    default: 'Intermedio'
  },
  // Información del usuario (si implementas autenticación)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // Coordenadas GPS si la planta está en exterior
  ubicacion: {
    latitud: {
      type: Number,
      min: [-90, 'Latitud inválida'],
      max: [90, 'Latitud inválida']
    },
    longitud: {
      type: Number,
      min: [-180, 'Longitud inválida'],
      max: [180, 'Longitud inválida']
    }
  },
  // Tags para búsqueda y filtrado
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Cada tag no puede exceder 30 caracteres']
  }],
  // Notas del usuario
  notas: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Personalizar la salida JSON
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

, 'i') },
    _id: { $ne: this._id },
    isActive: { $ne: false }
  });
  return count === 0;
}, 'Ya existe una planta activa con ese nombre');

// ==============================================
// EXPORTAR MODELO
// ==============================================

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;