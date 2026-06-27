/* ============================================================
   CONFIGURACIÓN — edita SOLO este archivo
   ============================================================ */
const CONFIG = {

  // 1) Tu API Key de Google Sheets (de Google Cloud Console)
  API_KEY: "AIzaSyBktzRq69HIrwTTb3_FUsckv8T9_bkfV7A",

  // 2) El ID de tu Google Sheet
  //    Está en la URL: docs.google.com/spreadsheets/d/  ESTE_ES_EL_ID  /edit
  SHEET_ID: "1EIDDVCgamSflju6v39qOATXsmcFRSRW7atR6R73fx8Q",

  // 3) Nombre de la pestaña/hoja y rango (déjalo así si tu hoja se llama "Hoja1")
  RANGE: "cpanel",

  // 4) Fila (1-indexada) donde están los nombres de los programadores.
  //    En tu archivo es la fila 4.
  HEADER_ROW: 4,

  // 5) Definición de los 4 programadores: etiqueta visible, columna de empresa
  //    y columna de estado (0 = A, 1 = B, 2 = C ...). Color del encabezado.
  PROGRAMADORES: [
    { label: "P1 ZÓCIMO",   empCol: 0, estCol: 1, color: "#1d4ed8", avatar: "👨" },
    { label: "P2 KATHERIN", empCol: 2, estCol: 3, color: "#7c2bbf", avatar: "👩" },
    { label: "P3 DARÍO",    empCol: 4, estCol: 5, color: "#1faa4d", avatar: "👨" },
    { label: "P4 IVÁN",     empCol: 6, estCol: 7, color: "#f08a1d", avatar: "👨" },
  ],

  // 6) Lógica de estados (en MAYÚSCULAS, sin espacios)
  //    Cualquier valor que no sea VERDE ni ROJO cuenta como "Por llamar".
  ESTADO_VERDE: ["OK"],
  ESTADO_ROJO:  ["X"],

  // 7) Refresco automático cada N segundos (0 = desactivado)
  AUTO_REFRESH_SEGUNDOS: 60,
};
