// ConnectedRoot-Mongo-API/seed.js
const mongoose = require('mongoose');
const Plant = require('./models/Plant');
require('dotenv').config();

// Datos de ejemplo para las plantas
const samplePlants = [
  {
    nombreComun: "Monstera Deliciosa",
    nombreCientifico: "Monstera deliciosa",
    temperatura: { min: 18, max: 27 },
    humedad: "60-70%",
    iluminacion: "Luz indirecta brillante",
    cuidadosExtra: "Regar cuando la tierra esté seca. Limpiar hojas regularmente.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    categoria: "Interior",
    dificultadCuidado: "Fácil",
    tags: ["tropical", "purificadora", "hojas grandes"],
    sensorData: {
      temperaturaActual: 23,
      humedadActual: 65,
      luzActual: 750,
      ultimaLectura: new Date()
    },
    notas: "Planta muy resistente, ideal para principiantes. Puede crecer bastante."
  },
  {
    nombreComun: "Pothos Dorado",
    nombreCientifico: "Epipremnum aureum",
    temperatura: { min: 15, max: 30 },
    humedad: "40-50%",
    iluminacion: "Luz indirecta",
    cuidadosExtra: "Muy resistente, ideal para principiantes. Puede crecer en agua.",
    image: "https://images.unsplash.com/photo-1586093918863-7ae6e4d8b8b7?w=400&h=400&fit=crop",
    categoria: "Interior",
    dificultadCuidado: "Fácil",
    tags: ["colgante", "purificadora", "resistente"],
    sensorData: {
      temperaturaActual: 21,
      humedadActual: 45,
      luzActual: 600,
      ultimaLectura: new Date()
    },
    notas: "Perfecta para colgar o como planta rastrera. Crece muy rápido."
  },
  {
    nombreComun: "Sansevieria",
    nombreCientifico: "Sansevieria trifasciata",
    temperatura: { min: 18, max: 27 },
    humedad: "30-40%",
    iluminacion: "Luz baja",
    cuidadosExtra: "Regar muy poco, resistente a la sequía. Ideal para espacios con poca luz.",
    image: "https://images.unsplash.com/photo-1621503833648-de8de1bddd10?w=400&h=400&fit=crop",
    categoria: "Interior",
    dificultadCuidado: "Fácil",
    tags: ["suculenta", "poca agua", "purificadora", "resistente"],
    sensorData: {
      temperaturaActual: 25,
      humedadActual: 35,
      luzActual: 400,
      ultimaLectura: new Date()
    },
    notas: "También conocida como 'Lengua de Suegra'. Muy resistente y purifica el aire."
  },
  {
    nombreComun: "Ficus Lyrata",
    nombreCientifico: "Ficus lyrata",
    temperatura: { min: 20, max: 28 },
    humedad: "50-60%",
    iluminacion: "Luz indirecta brillante",
    cuidadosExtra: "Necesita luz brillante pero no directa. Regar cuando la tierra esté seca.",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=400&fit=crop",
    categoria: "Interior",
    dificultadCuidado: "Intermedio",
    tags: ["árbol", "hojas grandes", "decorativa"],
    sensorData: {
      temperaturaActual: 24,
      humedadActual: 55,
      luzActual: 800,
      ultimaLectura: new Date()
    },
    notas: "Árbol de interior muy popular por sus hojas en forma de violín."
  },
  {
    nombreComun: "Aloe Vera",
    nombreCientifico: "Aloe barbadensis",
    temperatura: { min: 15, max: 32 },
    humedad: "20-30%",
    iluminacion: "Luz directa",
    cuidadosExtra: "Regar muy poco, dejar secar completamente entre riegos. Propiedades medicinales.",
    image: "https://images.unsplash.com/photo-1509423350716-97f2360af03e?w=400&h=400&fit=crop",
    categoria: "Suculenta",
    dificultadCuidado: "Fácil",
    tags: ["medicinal", "suculenta", "sol directo"],
    sensorData: {
      temperaturaActual: 28,
      humedadActual: 25,
      luzActual: 1200,
      ultimaLectura: new Date()
    },
    notas: "Excelente para quemaduras y heridas menores. Muy fácil de cuidar."
  },
  {
    nombreComun: "Pilea Peperomioides",
    nombreCientifico: "Pilea peperomioides",
    temperatura: { min: 16, max: 24 },
    humedad: "40-50%",
    iluminacion: "Luz indirecta",
    cuidadosExtra: "Rotar regularmente para crecimiento uniforme. Produce muchos hijuelos.",
    image: "https://images.unsplash.com/photo-1551456795-d44f83e20450?w=400&h=400&fit=crop",
    categoria: "Interior",
    dificultadCuidado: "Fácil",
    tags: ["compacta", "hijuelos", "moderna"],
    sensorData: {
      temperaturaActual: 20,
      humedadActual: 42,
      luzActual: 650,
      ultimaLectura: new Date()
    },
    notas: "También conocida como 'Planta del dinero chino'. Muy popular en redes sociales."
  },
  {
    nombreComun: "Lavanda",
    nombreCientifico: "Lavandula angustifolia",
    temperatura: { min: 10, max: 30 },
    humedad: "30-40%",
    iluminacion: "Sol pleno",
    cuidadosExtra: "Necesita mucho sol y buen drenaje. Podar después de la floración.",
    image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&h=400&fit=crop",
    categoria: "Exterior",
    dificultadCuidado: "Intermedio",
    tags: ["aromática", "flores", "exterior", "mediterránea"],
    sensorData: {
      temperaturaActual: 26,
      humedadActual: 35,
      luzActual: 1500,
      ultimaLectura: new Date()
    },
    ubicacion: {
      latitud: 25.6866,
      longitud: -100.3161
    },
    notas: "Perfecta para jardín mediterráneo. Flores muy aromáticas, ideal para té."
  },
  {
    nombreComun: "Cactus Barrel",
    nombreCientifico: "Echinocactus grusonii",
    temperatura: { min: 10, max: 35 },
    humedad: "10-20%",
    iluminacion: "Sol pleno",
    cuidadosExtra: "Regar muy esporádicamente, especialmente en invierno. Cuidado con las espinas.",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop",
    categoria: "Suculenta",
    dificultadCuidado: "Fácil",
    tags: ["cactus", "espinas", "desert", "resistente"],
    sensorData: {
      temperaturaActual: 30,
      humedadActual: 15,
      luzActual: 1800,
      ultimaLectura: new Date()
    },
    notas: "Cactus muy resistente, puede vivir muchos años. Crece lentamente."
  }
];

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/connectedroot';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB conectado para seeding');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Función para limpiar la base de datos
const cleanDatabase = async () => {
  try {
    await Plant.deleteMany({});
    console.log('🧹 Base de datos limpiada');
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
    throw error;
  }
};

// Función para crear plantas de ejemplo
const seedPlants = async () => {
  try {
    console.log('🌱 Creando plantas de ejemplo...');
    
    const createdPlants = await Plant.insertMany(samplePlants);
    console.log(`✅ ${createdPlants.length} plantas creadas exitosamente`);
    
    // Mostrar resumen
    createdPlants.forEach((plant, index) => {
      console.log(`${index + 1}. ${plant.nombreComun} (${plant.nombreCientifico})`);
    });
    
  } catch (error) {
    console.error('❌ Error creando plantas:', error);
    throw error;
  }
};

// Función para verificar los datos creados
const verifyData = async () => {
  try {
    const count = await Plant.countDocuments();
    const activePlants = await Plant.countDocuments({ isActive: { $ne: false } });
    
    console.log(`\n📊 Verificación de datos:`);
    console.log(`   Total de plantas: ${count}`);
    console.log(`   Plantas activas: ${activePlants}`);
    
    // Mostrar algunas estadísticas
    const stats = await Plant.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
          avgTemp: { $avg: '$sensorData.temperaturaActual' }
        }
      }
    ]);
    
    console.log(`\n📈 Por categoría:`);
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} plantas (temp. promedio: ${stat.avgTemp?.toFixed(1)}°C)`);
    });
    
  } catch (error) {
    console.error('❌ Error verificando datos:', error);
    throw error;
  }
};

// Función principal
const seedDatabase = async () => {
  try {
    console.log('🚀 Iniciando proceso de seeding...\n');
    
    await connectDB();
    
    // Preguntar si limpiar la base de datos
    const shouldClean = process.argv.includes('--clean') || process.argv.includes('-c');
    
    if (shouldClean) {
      console.log('⚠️  Limpiando base de datos existente...');
      await cleanDatabase();
    } else {
      // Solo verificar si ya hay datos
      const existingCount = await Plant.countDocuments();
      if (existingCount > 0) {
        console.log(`⚠️  Ya existen ${existingCount} plantas en la base de datos.`);
        console.log('   Usa --clean para limpiar primero, o continúa para agregar más datos.\n');
      }
    }
    
    await seedPlants();
    await verifyData();
    
    console.log('\n🎉 Seeding completado exitosamente!');
    console.log('💡 Puedes probar la API en: http://localhost:4000/api/plants\n');
    
  } catch (error) {
    console.error('❌ Error en el proceso de seeding:', error);
    process.exit(1);
  } finally {
    try {
      await mongoose.connection.close();
      console.log('🔒 Conexión MongoDB cerrada');
    } catch (error) {
      console.error('❌ Error cerrando conexión:', error);
    }
    process.exit(0);
  }
};

// Verificar si el script se ejecuta directamente
if (require.main === module) {
  console.log('ConnectedRoot - Database Seeder\n');
  
  // Mostrar ayuda
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('Uso:');
    console.log('  node seed.js          # Agregar datos de ejemplo');
    console.log('  node seed.js --clean  # Limpiar DB y agregar datos');
    console.log('  node seed.js --help   # Mostrar esta ayuda\n');
    process.exit(0);
  }
  
  seedDatabase();
}

module.exports = { seedDatabase, samplePlants };