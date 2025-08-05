const { MongoClient } = require('mongodb');
const fs = require('fs');

async function main() {
  const uri = 'mongodb+srv://0323105932:0323105932@rootdb.mnmbdoa.mongodb.net/RootDB?retryWrites=true&w=majority';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado a MongoDB');

    const db = client.db('RootDB');
    const collection = db.collection('Plants');  // NUEVA colección

    const data = JSON.parse(fs.readFileSync('./plantas_filtradas.json', 'utf8'));

    // Insertar documentos (puede ser masivo)
    const result = await collection.insertMany(data);
    console.log(`Documentos insertados: ${result.insertedCount}`);

  } catch (error) {
    console.error('Error al importar:', error);
  } finally {
    await client.close();
    console.log('Conexión cerrada');
  }
}

main();