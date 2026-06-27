/* ============================================================
   APP — no necesitas editar este archivo
   ============================================================ */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  function norm(v) {
    return (v == null ? "" : String(v)).trim().toUpperCase();
  }

  function clasificar(estadoRaw) {
    const e = norm(estadoRaw);
    if (CONFIG.ESTADO_VERDE.includes(e)) return "verde";
    if (CONFIG.ESTADO_ROJO.includes(e)) return "rojo";
    return "llamar"; // vacío u otro texto = por llamar
  }

  function pct(n, total) {
    return total ? (n / total) * 100 : 0;
  }

  function fmtPct(n, total) {
    return pct(n, total).toFixed(1) + "%";
  }

  /* ---- construye el degradado conic para un donut ---- */
  function conic(verde, llamar, rojo) {
    const t = verde + llamar + rojo || 1;
    const gEnd = (verde / t) * 360;
    const lEnd = gEnd + (llamar / t) * 360;
    const G = "#1faa4d", Gr = "#8a8f99", R = "#e23b2e";
    return `conic-gradient(${G} 0deg ${gEnd}deg, ${Gr} ${gEnd}deg ${lEnd}deg, ${R} ${lEnd}deg 360deg)`;
  }

  /* ---- procesa la matriz de valores del Sheet ---- */
  function procesar(values) {
    const startRow = CONFIG.HEADER_ROW; // primera fila de datos = header+1 (índice = HEADER_ROW)
    const progs = CONFIG.PROGRAMADORES.map((p) => ({
      ...p, verde: 0, rojo: 0, llamar: 0, total: 0,
    }));

    for (let r = startRow; r < values.length; r++) {
      const row = values[r] || [];
      progs.forEach((p) => {
        const emp = row[p.empCol];
        if (emp == null || String(emp).trim() === "") return; // sin empresa = no cuenta
        p.total++;
        const c = clasificar(row[p.estCol]);
        if (c === "verde") p.verde++;
        else if (c === "rojo") p.rojo++;
        else p.llamar++;
      });
    }

    const tot = {
      total: progs.reduce((a, p) => a + p.total, 0),
      verde: progs.reduce((a, p) => a + p.verde, 0),
      rojo: progs.reduce((a, p) => a + p.rojo, 0),
      llamar: progs.reduce((a, p) => a + p.llamar, 0),
      progCount: progs.length,
    };
    return { progs, tot };
  }

  /* ---- pinta todo en el DOM ---- */
  function render({ progs, tot }) {
    // Fecha de hoy
    const opts = { day: "numeric", month: "long", year: "numeric" };
    $("fecha").textContent = new Date().toLocaleDateString("es-EC", opts);

    // KPIs
    $("k-prog").textContent = tot.progCount;
    $("k-total").textContent = tot.total;
    $("k-verde").textContent = tot.verde;
    $("k-verde-pct").textContent = fmtPct(tot.verde, tot.total);
    $("k-llamar").textContent = tot.llamar;
    $("k-llamar-pct").textContent = fmtPct(tot.llamar, tot.total);
    $("k-rojo").textContent = tot.rojo;
    $("k-rojo-pct").textContent = fmtPct(tot.rojo, tot.total);

    // Donut principal
    const md = $("main-donut");
    md.style.background = conic(tot.verde, tot.llamar, tot.rojo);
    $("d-total").textContent = tot.total;
    $("lg-verde").textContent = `${tot.verde} (${fmtPct(tot.verde, tot.total)})`;
    $("lg-llamar").textContent = `${tot.llamar} (${fmtPct(tot.llamar, tot.total)})`;
    $("lg-rojo").textContent = `${tot.rojo} (${fmtPct(tot.rojo, tot.total)})`;

    // Incidencias
    $("inc-rojo").textContent = tot.rojo;
    $("inc-llamar").textContent = tot.llamar;
    $("inc-verde").textContent = tot.verde;

    // Tarjetas por programador
    const grid = $("prog-grid");
    grid.innerHTML = "";
    progs.forEach((p) => {
      const avance = fmtPct(p.verde, p.total);
      const card = document.createElement("div");
      card.className = "prog-card";
      card.innerHTML = `
        <div class="prog-head" style="background:${p.color}">
          <span class="avatar">${p.avatar}</span> ${p.label}
        </div>
        <div class="prog-body">
          <div class="tot-lbl">TOTAL EMPRESAS</div>
          <div class="tot-num">${p.total}</div>
          <div class="prog-donut" style="background:${conic(p.verde, p.llamar, p.rojo)}">
            <div class="center">${p.avatar}</div>
          </div>
          <div class="prog-legend">
            <div class="row"><span><span class="dot green"></span>Verde satisfactorio</span><b class="green">${p.verde}</b></div>
            <div class="row"><span><span class="dot gray"></span>Empresas por llamar</span><b class="gray">${p.llamar}</b></div>
            <div class="row"><span><span class="dot red"></span>Rojo no actualizado</span><b class="red">${p.rojo}</b></div>
          </div>
        </div>
        <div class="prog-foot" style="background:${p.color}12">
          AVANCE DE ACTUALIZACIÓN <span class="big" style="color:${p.color}">${avance}</span>
        </div>`;
      grid.appendChild(card);
    });
  }

  /* ---- carga desde Google Sheets ---- */
  function url() {
    const id = encodeURIComponent(CONFIG.SHEET_ID);
    const range = encodeURIComponent(CONFIG.RANGE);
    const key = encodeURIComponent(CONFIG.API_KEY);
    return `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?key=${key}`;
  }

  function showError(msg) {
    $("loader").hidden = true;
    $("app").hidden = true;
    $("error").hidden = false;
    $("error-msg").textContent = msg;
  }

  /* ---- datos de ejemplo cuando no hay credenciales ---- */
  function datosDemo() {
    const progs = CONFIG.PROGRAMADORES.map((p, i) => {
      const base = [
        { verde: 12, llamar: 5, rojo: 3 },
        { verde: 9,  llamar: 7, rojo: 2 },
        { verde: 15, llamar: 3, rojo: 1 },
        { verde: 8,  llamar: 6, rojo: 4 },
      ][i % 4];
      return { ...p, ...base, total: base.verde + base.llamar + base.rojo };
    });
    const tot = {
      total: progs.reduce((a, p) => a + p.total, 0),
      verde: progs.reduce((a, p) => a + p.verde, 0),
      rojo: progs.reduce((a, p) => a + p.rojo, 0),
      llamar: progs.reduce((a, p) => a + p.llamar, 0),
      progCount: progs.length,
    };
    return { progs, tot };
  }

  async function cargar() {
    if (CONFIG.API_KEY.startsWith("PEGA_") || CONFIG.SHEET_ID.startsWith("PEGA_")) {
      // Sin credenciales: mostramos el sitio con datos de ejemplo + aviso
      render(datosDemo());
      const banner = $("demo-banner");
      banner.hidden = false;
      banner.className = "demo-banner";
      banner.innerHTML = '⚠️ <b>Modo de ejemplo:</b> estos datos NO son reales. Para ver tu información real, configura tu <b>API Key</b> y el <b>ID del Sheet</b> en el archivo <b>config.js</b>.';
      $("loader").hidden = true;
      $("error").hidden = true;
      $("app").hidden = false;
      return;
    }
    $("demo-banner").hidden = true;
    try {
      const res = await fetch(url());
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Google respondió ${res.status}. ${t.slice(0, 200)}`);
      }
      const data = await res.json();
      const values = data.values || [];
      if (!values.length) throw new Error("El Sheet no devolvió filas. Revisa el RANGE.");
      render(procesar(values));
      const banner = $("demo-banner");
      banner.hidden = false;
      banner.className = "demo-banner connected";
      banner.innerHTML = '✅ <b>Conectado</b> — mostrando tus datos reales de Google Sheets.';
      $("loader").hidden = true;
      $("error").hidden = true;
      $("app").hidden = false;
    } catch (err) {
      showError(err.message || String(err));
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("refresh-btn").addEventListener("click", cargar);
    cargar();
    if (CONFIG.AUTO_REFRESH_SEGUNDOS > 0) {
      setInterval(cargar, CONFIG.AUTO_REFRESH_SEGUNDOS * 1000);
    }
  });
})();
