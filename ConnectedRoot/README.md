# ConnectedRoot

Aplicación móvil desarrollada en React Native con Expo. Este repositorio contiene la interfaz del proyecto **ConnectedRoot**, lista para ejecutar en modo desarrollo.

---

## 📦 Requisitos Previos

Antes de comenzar asegúrate de tener instaladas las siguientes herramientas:

- **Node.js** (versión recomendada: 18.x o 20.x)
- **npm** (v9 o superior)
- **Expo CLI**  
  Instalar con:  
  ```bash
  npm install -g expo-cli
  ```
- **Git**
- Un emulador Android o un dispositivo físico con la app [Expo Go](https://expo.dev/client)

---

## 🚀 Instrucciones para iniciar el proyecto

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/T1tino/ConnectedRoot.git
   cd ConnectedRoot
   ```

2. **Instala las dependencias exactas**
   > Se utiliza `package-lock.json` para asegurar compatibilidad exacta entre versiones de dependencias.
   ```bash
   npm ci
   ```

3. **Ejecuta el proyecto**
   ```bash
   npx expo start
   ```

   Esto abrirá una ventana en tu navegador. Desde ahí puedes:
   - Escanear el código QR con **Expo Go** (en tu celular).
   - Presionar `a` para abrir en un emulador Android (si tienes uno configurado).

---

## 🛠 Instalación de dependencias adicionales (en caso de errores)

Si te aparece un error como:
```
Unable to resolve "react-native-chart-kit"
```
Ejecuta:
```bash
npm install react-native-chart-kit react-native-svg
```

⚠️ Recuerda volver a ejecutar `npx expo start` después de instalar nuevas dependencias.

---

## 🧼 Limpieza de caché (si hay errores extraños)

```bash
npx expo start -c
```

---

## ✅ Notas adicionales

- No modifiques ni borres el archivo `package-lock.json`, ya que asegura que todos los equipos usen **exactamente las mismas versiones** de cada dependencia.
- Si agregas nuevos paquetes, usa `npm install nombre-del-paquete` y después sube también el `package-lock.json`.

---

## 👨‍💻 Contacto del autor

- GitHub: [@T1tino](https://github.com/T1tino)
