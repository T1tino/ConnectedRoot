const collections = db.getCollectionNames();

collections.forEach(name => {
  const doc = db.getCollection(name).findOne();
  if (doc) {
    print(`\n📦 Colección: ${name}`);
    print(`🔑 Campos: ${Object.keys(doc).join(', ')}`);
  } else {
    print(`\n📦 Colección: ${name} (vacía)`);
  }
});
