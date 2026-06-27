# Reporte de CPanel — Dashboard conectado a Google Sheets

Página web (HTML + CSS + JS) que replica tu infografía y se actualiza
automáticamente leyendo los datos de tu Google Sheet. Cada vez que agregas
o cambias una fila en la hoja, la página refleja los nuevos conteos.

---

## 1. Configurar el acceso (solo se hace una vez)

### a) Hacer la hoja legible por API Key
La API Key solo puede leer hojas con permiso de lectura para "cualquiera con el enlace".
En tu Google Sheet: **Compartir → Acceso general → Cualquier persona con el enlace → Lector**.

### b) Crear la API Key
1. Entra a https://console.cloud.google.com/
2. Crea un proyecto (o usa uno existente).
3. Menú → **APIs y servicios → Biblioteca** → busca **Google Sheets API** → **Habilitar**.
4. Menú → **APIs y servicios → Credenciales → Crear credenciales → Clave de API**.
5. Copia la clave. (Recomendado: en "Restricciones de API" limítala a *Google Sheets API*,
   y en "Restricciones de aplicación" agrega tu dominio de GitHub Pages.)

### c) Obtener el ID del Sheet
Está en la URL de tu hoja:
`https://docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_ID`**`/edit`

---

## 2. Editar `config.js`

Abre **config.js** y completa:

```js
API_KEY:  "tu_api_key",
SHEET_ID: "el_id_de_tu_sheet",
RANGE:    "Hoja1!A1:H100",   // cambia "Hoja1" si tu pestaña tiene otro nombre
```

No necesitas tocar ningún otro archivo.

### Estructura esperada de la hoja
- Fila 4: nombres de programadores (P1, CPANEL, P2, CPANEL, …)
- Desde la fila 5: empresas y su estado.
- Columnas por programador: A/B = P1, C/D = P2, E/F = P3, G/H = P4.
- Estados: `OK` = Verde · `x` = Rojo · vacío u otro texto = Por llamar.

Si tu hoja crece más allá de la fila 100, aumenta el rango (ej. `Hoja1!A1:H300`).

---

## 3. Subir a GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube estos 4 archivos: `index.html`, `styles.css`, `app.js`, `config.js`.
3. En el repo: **Settings → Pages → Source: Deploy from a branch → main / root → Save**.
4. En 1–2 minutos tu página estará en `https://TU_USUARIO.github.io/TU_REPO/`.

---

## Notas
- La página se refresca sola cada 60 s (configurable en `config.js`, `AUTO_REFRESH_SEGUNDOS`).
- También hay un botón **Actualizar** abajo a la derecha.
- La fecha mostrada es la del día en que se abre la página.
- ⚠️ La API Key queda visible en el código del navegador (es normal en sitios estáticos).
  Por eso conviene restringirla a *solo Google Sheets API* y a tu dominio de Pages.
