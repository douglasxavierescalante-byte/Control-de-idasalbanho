# Control de Salidas y Regresos

App web para registrar la hora de salida y regreso de estudiantes (por grado/sección),
sincronizada en tiempo real entre dispositivos usando **Firebase Realtime Database**.

## 1. Crear el proyecto en Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) e inicia
   sesión con tu cuenta de Google.
2. Clic en **"Crear un proyecto"**, ponle un nombre (ej. `control-salidas`) y puedes
   desactivar Google Analytics.
3. En el menú izquierdo, entra a **"Realtime Database"** → **"Crear base de datos"**.
4. Elige cualquier ubicación y selecciona **"Comenzar en modo de prueba"**.
5. Ve a la pestaña **"Reglas"** y reemplaza el contenido con:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
6. Clic en **"Publicar"**.

> **Nota de seguridad:** estas reglas dejan la base de datos abierta a cualquiera que
> tenga la URL — razonable para un registro escolar interno de bajo riesgo. Si más
> adelante quieres restringirlo, se puede hacer con Firebase Authentication.

## 2. Obtener la configuración

1. Ícono de engranaje ⚙ → **"Configuración del proyecto"**.
2. Baja hasta **"Tus apps"** → clic en **`</>`** (Web).
3. Ponle un apodo (ej. `app-salidas`) y clic en **"Registrar app"**.
4. Copia el objeto `firebaseConfig` que te muestra.

## 3. Conectar la app

Abre `index.html` y busca este bloque cerca del inicio del `<script>`:
```js
const firebaseConfig = {
  apiKey: "PEGA_AQUI",
  authDomain: "PEGA_AQUI",
  databaseURL: "PEGA_AQUI",
  projectId: "PEGA_AQUI",
  storageBucket: "PEGA_AQUI",
  messagingSenderId: "PEGA_AQUI",
  appId: "PEGA_AQUI"
};
```
Reemplázalo con el que copiaste de Firebase. Guarda el archivo.

## 4. Publicar en GitHub Pages

1. Crea un repositorio en [github.com/new](https://github.com/new).
2. Sube `index.html` y `README.md` (botón **Add file → Upload files**).
3. Ve a **Settings → Pages** → en **Source** elige la rama `main` y carpeta `/ (root)`.
4. Espera 1-2 minutos. Tu app queda en `https://TU-USUARIO.github.io/TU-REPOSITORIO/`.

### Alternativa por terminal
```bash
cd salidas-app
git init
git add .
git commit -m "Control de salidas y regresos"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

## ¿Por qué Firebase y no Google Sheets?

Los navegadores bloquean por seguridad (CORS) las llamadas directas desde una página
en un dominio (tu GitHub Pages) hacia una hoja de cálculo de Google Apps Script, y ese
bloqueo se comporta de forma inconsistente según navegador y dispositivo. Firebase
Realtime Database está diseñado específicamente para este caso: acepta conexiones
desde cualquier sitio web, sincroniza los cambios al instante (sin necesidad de
recargar), y no depende de redirecciones frágiles.

## Solución de problemas

- **"Falta configurar Firebase"**: no reemplazaste `firebaseConfig` en el código, o
  quedó algún campo como `"PEGA_AQUI"`.
- **"Error de conexión: permission_denied"**: revisa las reglas en la pestaña "Reglas"
  de Realtime Database (paso 1.5).
- **Los cambios no aparecen en otro dispositivo**: confirma que ambos abren la misma
  URL publicada (no un archivo local) y que tienen internet.

## Agregar más grados o secciones

Edita el objeto `GRADES` al inicio del `<script>` en `index.html` y agrega una nueva
clave con el nombre de la sección y su lista de estudiantes. Firebase crea
automáticamente la rama de datos correspondiente la primera vez que se use.
