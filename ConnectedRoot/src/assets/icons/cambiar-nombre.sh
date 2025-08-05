#!/bin/bash

# Ruta del directorio (puedes cambiarlo)
DIRECTORIO=$PWD

# Buscar todos los archivos que tengan @2x en el nombre
find "$DIRECTORIO" -type f -name "*@2x.*" | while read archivo; do
  # Extraer nombre base quitando @2x
  nuevo_nombre=$(echo "$archivo" | sed 's/@2x//')

  echo "🗂️ Copiando:"
  echo "  De: $archivo"
  echo "  A : $nuevo_nombre"

  cp "$archivo" "$nuevo_nombre"
done

echo "✅ Archivos copiados sin @2x"
