# Control de Salidas y Regresos

App web para registrar la hora de salida y regreso de estudiantes (por grado/sección),
guardando todo en una hoja de cálculo de Google Sheets compartida entre dispositivos.

## 1. Crear el backend en Google Sheets

1. Crea una hoja nueva en [sheets.google.com](https://sheets.google.com).
2. Ve a **Extensiones → Apps Script**.
3. Borra el contenido por defecto y pega el código de [`apps-script/Code.gs`](apps-script/Code.gs).
4. Guarda (Ctrl/Cmd+S).
5. Haz clic en **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo (tu correo)**
   - Quién tiene acceso: **Cualquier usuario**
6. Clic en **Implementar**, autoriza los permisos, y copia la **URL de la aplicación web**
   (termina en `/exec`).
7. **Pruébala** pegando en el navegador: `TU_URL/exec?grade=2A` — debe mostrar `{"records":[]}`.
   Si no, revisa la sección de solución de problemas más abajo.

## 2. Conectar la app a tu hoja

Tienes dos opciones (edita `index.html`):

**Opción A — recomendada para uso compartido:** pega tu URL directamente en el código,
en la línea:
```js
const HARDCODED_SHEETS_URL = ""; // pega aquí tu URL de Apps Script
```
Así todos los que abran la app ya la ven conectada, sin configurar nada.

**Opción B:** deja esa línea vacía y cada persona configura la URL una sola vez desde
el botón **⚙ Configurar** dentro de la app (se guarda en su navegador).

## 3. Publicar en GitHub Pages

### Desde la web de GitHub (sin usar la terminal)
1. Crea un repositorio nuevo en [github.com/new](https://github.com/new) (puede ser público o privado).
2. Sube estos archivos (botón **Add file → Upload files**): `index.html`, `README.md`,
   y la carpeta `apps-script/`.
3. Ve a **Settings → Pages**.
4. En **Source**, elige la rama `main` y la carpeta `/ (root)`. Guarda.
5. Espera 1-2 minutos. GitHub te dará una URL tipo:
   `https://TU-USUARIO.github.io/TU-REPOSITORIO/`
6. Abre esa URL desde cualquier celular o computadora — ya es tu app publicada.

### Desde la terminal (si prefieres usar git)
```bash
cd salidas-app
git init
git add .
git commit -m "Control de salidas y regresos"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```
Luego activa **Settings → Pages** como en el paso 3-4 de arriba.

## Solución de problemas

- **"No se pudo conectar con la hoja de cálculo"**: abre la URL de Apps Script directamente
  en el navegador con `?grade=2A` al final.
  - Si pide iniciar sesión → tu implementación no tiene acceso "Cualquier usuario". Ve a
    **Implementar → Administrar implementaciones → Editar (lápiz)** y corrige el acceso.
  - Si da error 404/"Script function not found" → revisa que pegaste bien todo el código
    de `Code.gs` y que lo guardaste antes de implementar.
  - Si usaste la URL que termina en `/dev` en vez de `/exec` → usa siempre la de `/exec`.
- **Cambios que hiciste en el script no se reflejan**: cada vez que edites `Code.gs`
  necesitas **Implementar → Administrar implementaciones → Editar → Nueva versión → Implementar**
  (no solo guardar el archivo).
- **Los datos no se comparten entre dispositivos**: asegúrate de usar la Opción A
  (`HARDCODED_SHEETS_URL`) o que todos los dispositivos hayan configurado la misma URL
  manualmente con el botón ⚙ Configurar.

## Agregar más grados o secciones

Edita el objeto `GRADES` al inicio del `<script>` en `index.html` y agrega una nueva
clave con el nombre de la sección y su lista de estudiantes. El script de Apps Script
crea automáticamente una pestaña nueva en la hoja con ese mismo nombre.
