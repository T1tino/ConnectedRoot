#!/bin/bash
set -e

SHARED_ENV=".env.shared"
FRONT_ENV="ConnectedRoot/.env"
BACK_ENV="plants-backend/.env"

# Detectar IP wlan0
IP=$(ip -4 addr show wlan0 2>/dev/null | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
if [ -z "$IP" ]; then
  echo "⚠️ No se detectó IP en wlan0, usando valor por defecto"
  IP="192.168.0.100"
fi

API_URL="http://$IP:3000/api"
echo "🌐 IP detectada: $IP"
echo "📝 Actualizando $SHARED_ENV con API_BASE_URL=$API_URL"

# 1) Actualizar .env.shared con el valor literal (la IP resuelta)
echo "API_BASE_URL=$API_URL" > "$SHARED_ENV"

# 2) Actualizar front y back .env para que usen la referencia ${API_BASE_URL}
for ENV_FILE in "$FRONT_ENV" "$BACK_ENV"; do
  echo "🔄 Actualizando $ENV_FILE para usar \${API_BASE_URL}"

  mkdir -p "$(dirname "$ENV_FILE")"

  # Si el archivo no existe, crear uno nuevo con la línea correcta
  if [ ! -f "$ENV_FILE" ]; then
    echo 'API_BASE_URL=${API_BASE_URL}' > "$ENV_FILE"
    continue
  fi

  # Reemplazar la línea que comience con API_BASE_URL= con la referencia
  # Si no existe, agregarla al final
  if grep -q '^API_BASE_URL=' "$ENV_FILE"; then
    sed -i 's|^API_BASE_URL=.*|API_BASE_URL=${API_BASE_URL}|' "$ENV_FILE"
  else
    echo 'API_BASE_URL=${API_BASE_URL}' >> "$ENV_FILE"
  fi
done

echo "✅ ¡Listo! Archivos actualizados."
