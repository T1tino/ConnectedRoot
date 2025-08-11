#!/bin/bash
set -e

# Rutas relativas
SHARED_ENV="../.env.shared"
FRONT_ENV="./.env"
BACK_ENV="../plants-backend/.env"
BACKEND_DIR="../plants-backend"

# Detectar IP wlan0
IP=$(ip -4 addr show wlan0 2>/dev/null | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
if [ -z "$IP" ]; then
  echo " No se detectó IP en wlan0, usando valor por defecto"
  IP="192.168.0.100"
fi

API_URL="http://$IP:3000/api"
echo " IP detectada: $IP"
echo " Actualizando $SHARED_ENV con API_BASE_URL=$API_URL"

# Actualizar .env.shared
echo "API_BASE_URL=$API_URL" > "$SHARED_ENV"

# Actualizar front y back .env para usar ${API_BASE_URL}
for ENV_FILE in "$FRONT_ENV" "$BACK_ENV"; do
  echo " Actualizando $ENV_FILE para usar \${API_BASE_URL}"

  mkdir -p "$(dirname "$ENV_FILE")"

  if [ ! -f "$ENV_FILE" ]; then
    echo 'API_BASE_URL=${API_BASE_URL}' > "$ENV_FILE"
    continue
  fi

  if grep -q '^API_BASE_URL=' "$ENV_FILE"; then
    sed -i 's|^API_BASE_URL=.*|API_BASE_URL=${API_BASE_URL}|' "$ENV_FILE"
  else
    echo 'API_BASE_URL=${API_BASE_URL}' >> "$ENV_FILE"
  fi
done

echo " Variables de entorno actualizadas."

# Función para limpiar backend al salir
cleanup() {
  echo " Deteniendo backend (PID $BACKEND_PID)..."
  kill $BACKEND_PID
  wait $BACKEND_PID
  echo " Backend detenido."
  exit
}

# Capturar señales para limpiar
trap cleanup INT TERM

# Arrancar backend (en segundo plano)
echo " Iniciando backend con npm start en $BACKEND_DIR..."
(
  cd "$BACKEND_DIR"
  npm start
) &
BACKEND_PID=$!

sleep 3  # Esperar un poco para que backend inicie

echo " Backend iniciado con PID $BACKEND_PID."

# Arrancar frontend (en primer plano)
echo " Iniciando frontend con npx expo start $*"
npx expo start "$@"

# Cuando frontend termine normalmente, limpiar backend
cleanup
