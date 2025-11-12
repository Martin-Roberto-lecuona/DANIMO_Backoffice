const API_FETCH_URL = "https://danimo-fre6fpbjezcyhxed.canadacentral-01.azurewebsites.net/auth/data";
const API_RESET_URL = "https://danimo-fre6fpbjezcyhxed.canadacentral-01.azurewebsites.net/auth/reset";
const API_NOTIFY_URL = "https://danimo-fre6fpbjezcyhxed.canadacentral-01.azurewebsites.net/notification/broadcast";
// Helpers
function showStatus(txt){ document.getElementById("statusText").textContent = "Estado: " + txt; }
function updateLastCalled(){ document.getElementById("lastCalled").textContent = "Última acción: " + new Date().toLocaleString(); }

function buildUrl(base, email){
  try {
    const u = new URL(base);
    u.searchParams.set("email", email);
    return u.toString();
  } catch(e){
    // fallback simple
    return base + (base.includes("?") ? "&" : "?") + "email=" + encodeURIComponent(email);
  }
}

// UI helpers
function createTableFromObject(obj) {
  const table = document.createElement("table");
  table.className = "data";
  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  ["Campo","Valor"].forEach(h => { const th = document.createElement("th"); th.textContent = h; trh.appendChild(th); });
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  Object.keys(obj).forEach(key => {
    const tr = document.createElement("tr");
    const tdKey = document.createElement("td"); tdKey.textContent = key;
    const tdVal = document.createElement("td");
    const val = obj[key];
    if (typeof val === "object" && val !== null) {
      const pre = document.createElement("pre"); pre.className = "json"; pre.textContent = JSON.stringify(val, null, 2);
      tdVal.appendChild(pre);
    } else {
      tdVal.textContent = val === null || val === undefined ? "" : String(val);
    }
    tr.appendChild(tdKey); tr.appendChild(tdVal);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

// ImportantEvents: similar a subtabla, pero se coloca en su sección
function renderImportantEventsSection(value){
  const container = document.getElementById("importantEventsContainer");
  container.innerHTML = "";
  if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
    container.textContent = "(sin eventos importantes)";
    return;
  }

  // si es array
  if (Array.isArray(value)) {
    // crear tabla con columnas detectadas
    const keys = Array.from(value.reduce((acc, item) => { Object.keys(item).forEach(k=>acc.add(k)); return acc; }, new Set()));
    const table = document.createElement("table"); table.className = "data subtable";
    const thead = document.createElement("thead"); const trh = document.createElement("tr");
    ["Evento"].concat(keys).forEach(h => { const th = document.createElement("th"); th.textContent = h; trh.appendChild(th); });
    thead.appendChild(trh); table.appendChild(thead);
    const tbody = document.createElement("tbody");
    value.forEach((it, idx) => {
      const tr = document.createElement("tr");
      const tdIdx = document.createElement("td"); tdIdx.textContent = String(idx+1); tr.appendChild(tdIdx);
      keys.forEach(k => {
        const td = document.createElement("td");
        if (typeof it[k] === "object" && it[k] !== null) {
          const pre = document.createElement("pre"); pre.className = "json"; pre.textContent = JSON.stringify(it[k], null, 2); td.appendChild(pre);
        } else td.textContent = it[k] ?? "";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
    return;
  }

  // si es objeto: keys = eventos
  const rows = Object.keys(value).map(k => ({ key: k, val: value[k] }));
  const table = document.createElement("table"); table.className = "data subtable";
  const thead = document.createElement("thead"); const trh = document.createElement("tr");
  ["Evento","Detalle"].forEach(h => { const th = document.createElement("th"); th.textContent = h; trh.appendChild(th); });
  thead.appendChild(trh); table.appendChild(thead);
  const tbody = document.createElement("tbody");
  rows.forEach(r => {
    const tr = document.createElement("tr");
    const tdKey = document.createElement("td"); tdKey.textContent = r.key; tr.appendChild(tdKey);
    const tdVal = document.createElement("td");
    if (typeof r.val === "object" && r.val !== null) {
      const pre = document.createElement("pre"); pre.className = "json"; pre.textContent = JSON.stringify(r.val, null, 2); tdVal.appendChild(pre);
    } else tdVal.textContent = String(r.val ?? "");
    tr.appendChild(tdVal); tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

// MoodAlternators: similar a ImportantEvents
function renderMoodAlternatorsSection(value){
  const container = document.getElementById("moodAlternatorsContainer");
  container.innerHTML = "";
  if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
    container.textContent = "(sin alternadores de ánimo)";
    return;
  }

  // si es array
  if (Array.isArray(value)) {
    const keys = Array.from(value.reduce((acc, item) => { Object.keys(item).forEach(k=>acc.add(k)); return acc; }, new Set()));
    const table = document.createElement("table"); table.className = "data subtable";
    const thead = document.createElement("thead"); const trh = document.createElement("tr");
    ["#"].concat(keys).forEach(h => { const th = document.createElement("th"); th.textContent = h; trh.appendChild(th); });
    thead.appendChild(trh); table.appendChild(thead);
    const tbody = document.createElement("tbody");
    value.forEach((it, idx) => {
      const tr = document.createElement("tr");
      const tdIdx = document.createElement("td"); tdIdx.textContent = String(idx+1); tr.appendChild(tdIdx);
      keys.forEach(k => {
        const td = document.createElement("td");
        if (typeof it[k] === "object" && it[k] !== null) {
          const pre = document.createElement("pre"); pre.className = "json"; pre.textContent = JSON.stringify(it[k], null, 2); td.appendChild(pre);
        } else td.textContent = it[k] ?? "";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
    return;
  }

  // si es objeto
  const rows = Object.keys(value).map(k => ({ key: k, val: value[k] }));
  const table = document.createElement("table"); table.className = "data subtable";
  const thead = document.createElement("thead"); const trh = document.createElement("tr");
  ["Clave","Valor"].forEach(h => { const th = document.createElement("th"); th.textContent = h; trh.appendChild(th); });
  thead.appendChild(trh); table.appendChild(thead);
  const tbody = document.createElement("tbody");
  rows.forEach(r => {
    const tr = document.createElement("tr");
    const tdKey = document.createElement("td"); tdKey.textContent = r.key; tr.appendChild(tdKey);
    const tdVal = document.createElement("td");
    if (typeof r.val === "object" && r.val !== null) {
      const pre = document.createElement("pre"); pre.className = "json"; pre.textContent = JSON.stringify(r.val, null, 2); tdVal.appendChild(pre);
    } else tdVal.textContent = String(r.val ?? "");
    tr.appendChild(tdVal); tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

// SleepRegisters renderer (igual que antes)
function renderSleepRegisters(value){
  const wrapper = document.createElement("div");
  if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
    wrapper.textContent = "(sin registros de sueño)";
    return wrapper;
  }

  let records = [];

  if (Array.isArray(value)) {
    records = value.map(r => {
      let dateStr = null;
      if (r.date) dateStr = r.date;
      else if (r.createdAt) dateStr = r.createdAt;
      else {
        for (const k in r) {
          if (typeof r[k] === "string" && /\d{4}-\d{2}-\d{2}/.test(r[k])) { dateStr = r[k]; break; }
        }
      }
      return { date: dateStr, record: r };
    });
  } else {
    records = Object.keys(value).map(k => ({ date: k, record: value[k] }));
  }

  records = records.map(r => {
    const d = r.date ? new Date(r.date) : null;
    return { dateRaw: r.date || null, dateObj: isNaN(d) ? null : d, record: r.record };
  });

  records.sort((a,b) => {
    if (a.dateObj && b.dateObj) return a.dateObj - b.dateObj;
    if (a.dateObj) return -1;
    if (b.dateObj) return 1;
    return 0;
  });

  const table = document.createElement("table"); table.className = "data subtable";
  const thead = document.createElement("thead"); const trh = document.createElement("tr");
  ["Fecha", "Detalle"].forEach(h => { const th = document.createElement("th"); th.textContent = h; trh.appendChild(th); });
  thead.appendChild(trh); table.appendChild(thead);

  const tbody = document.createElement("tbody");
  records.forEach(r => {
    const tr = document.createElement("tr");
    const tdDate = document.createElement("td");
    tdDate.textContent = r.dateRaw ? (r.dateObj ? r.dateObj.toISOString().split('T')[0] : r.dateRaw) : "(sin fecha)";
    tr.appendChild(tdDate);
    const tdDetail = document.createElement("td");
    if (typeof r.record === "object" && r.record !== null) {
      const pre = document.createElement("pre"); pre.className = "json"; pre.textContent = JSON.stringify(r.record, null, 2); tdDetail.appendChild(pre);
    } else tdDetail.textContent = String(r.record);
    tr.appendChild(tdDetail); tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

// Render principal (muestra campos principales y coloca secciones)
function renderMainTable(obj) {
  const container = document.getElementById("resultArea");
  container.innerHTML = "";

  if (!obj || typeof obj !== "object") {
    container.textContent = "Respuesta inválida";
    return;
  }

  const table = document.createElement("table"); table.className = "data";
  const thead = document.createElement("thead"); const trh = document.createElement("tr");
  ["Campo","Valor"].forEach(h => { const th = document.createElement("th"); th.textContent = h; trh.appendChild(th); });
  thead.appendChild(trh); table.appendChild(thead);
  const tbody = document.createElement("tbody");

  const preferredOrder = ["id","firstName","lastName","email","birthDate","gender"];
  const keys = Array.from(new Set([...preferredOrder.filter(k=>k in obj), ...Object.keys(obj).filter(k=>!preferredOrder.includes(k))]));

  keys.forEach(key => {
    if (key === "ImportantEvents" || key === "MoodAlternators" || key === "SleepRegisters") {
      // No mostrar aquí: se colocan en sus secciones
      const tr = document.createElement("tr");
      const tdKey = document.createElement("td"); tdKey.textContent = key;
      const tdVal = document.createElement("td");
      if (key === "SleepRegisters") {
        tdVal.appendChild(renderSleepRegisters(obj[key]));
      } else {
        tdVal.textContent = "(ver sección abajo)";
      }
      tr.appendChild(tdKey); tr.appendChild(tdVal); tbody.appendChild(tr);
    } else {
      const tr = document.createElement("tr");
      const tdKey = document.createElement("td"); tdKey.textContent = key;
      const tdVal = document.createElement("td");
      const val = obj[key];
      if (typeof val === "object" && val !== null) {
        const pre = document.createElement("pre"); pre.className = "json"; pre.textContent = JSON.stringify(val, null, 2);
        tdVal.appendChild(pre);
      } else tdVal.textContent = val === null || val === undefined ? "" : String(val);
      tr.appendChild(tdKey); tr.appendChild(tdVal); tbody.appendChild(tr);
    }
  });

  table.appendChild(tbody);
  container.appendChild(table);

  // actualizar secciones
  renderImportantEventsSection(obj.ImportantEvents);
  renderMoodAlternatorsSection(obj.MoodAlternators);
  // SleepRegisters ya fue colocada en la tabla principal (como subtabla) pero la sección puede mostrarlo también:
  const seccionSleep = document.getElementById("section-important-events"); // no hacer nada especial aquí
}

// fetch / reset
async function fetchInfo(email){
  if(!email) { alert("Ingresá un email válido"); return; }
  showStatus("consultando...");
  updateLastCalled();
  document.getElementById("infoCard").hidden = false;

  const url = buildUrl(API_FETCH_URL, email);
  try {
    const resp = await fetch(url, { method: "GET", credentials: "omit" });
    if (!resp.ok) {
      showStatus("error: " + resp.status);
      document.getElementById("resultArea").textContent = "Error: " + resp.status + " — " + await resp.text();
      return;
    }
    const contentType = resp.headers.get("content-type") || "";
    let data;
    if (contentType.includes("application/json")) data = await resp.json();
    else {
      const txt = await resp.text();
      try { data = JSON.parse(txt); } catch(e) { data = { raw: txt }; }
    }

    if (data && typeof data === "object") {
      const wrapperKeys = ["data", "result", "rows", "items"];
      for (const k of wrapperKeys) {
        if (k in data) { data = data[k]; break; }
      }
    }

    if (Array.isArray(data) && data.length === 1 && typeof data[0] === "object") data = data[0];

    renderMainTable(data);
    showStatus("resultado recibido");
  } catch (err) {
    showStatus("error de conexión");
    document.getElementById("resultArea").textContent = "Error de conexión: " + String(err);
  }
}

async function resetDay(email){
  if(!email) { alert("Ingresá un email válido"); return; }
  if (!confirm("¿Confirmas borrar los datos del día para " + email + " ?")) return;
  showStatus("borrando...");
  updateLastCalled();
  document.getElementById("infoCard").hidden = false;

  const url = buildUrl(API_RESET_URL, email);
  try {
    const resp = await fetch(url, { method: "GET", credentials: "omit" });
    const txt = await resp.text();
    try {
      const json = JSON.parse(txt);
      renderMainTable(json);
    } catch(e){
      document.getElementById("resultArea").textContent = txt || "Borrado completado";
    }
    showStatus("borrado completado");
  } catch (err) {
    showStatus("error al borrar");
    document.getElementById("resultArea").textContent = "Error: " + String(err);
  }
}

// Collapsible behavior
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const body = document.getElementById(targetId);
    if (!body) return;
    const isOpen = body.style.display === 'block';
    body.style.display = isOpen ? 'none' : 'block';
    btn.textContent = isOpen ? 'Abrir' : 'Cerrar';
  });
});
// also allow clicking header to toggle
document.querySelectorAll('.section-header').forEach(h => {
  h.addEventListener('click', (e) => {
    // ignore clicks on buttons (they are handled separately)
    if (e.target && e.target.tagName === 'BUTTON') return;
    const targetId = h.getAttribute('data-target');
    const body = document.getElementById(targetId);
    const btn = h.querySelector('.toggle-btn');
    if (!body || !btn) return;
    const isOpen = body.style.display === 'block';
    body.style.display = isOpen ? 'none' : 'block';
    btn.textContent = isOpen ? 'Abrir' : 'Cerrar';
  });
});

// eventos
document.getElementById("btnFetch").addEventListener("click", () => fetchInfo(document.getElementById("email").value.trim()));
document.getElementById("btnReset").addEventListener("click", () => resetDay(document.getElementById("email").value.trim()));
document.getElementById("btnClearUI").addEventListener("click", () => {
  document.getElementById("resultArea").innerHTML = "";
  document.getElementById("importantEventsContainer").innerHTML = "(sin datos)";
  document.getElementById("moodAlternatorsContainer").innerHTML = "(sin datos)";
  document.getElementById("infoCard").hidden = true;
  showStatus("listo");
  document.getElementById("lastCalled").textContent = "";
  // collapse sections
  ['important-events-body','mood-alternators-body'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.querySelectorAll('.toggle-btn').forEach(b => b.textContent = 'Abrir');
});

// Enter para submit
document.getElementById("email").addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); fetchInfo(document.getElementById("email").value.trim()); }
});

// init
showStatus("listo");
// start sections collapsed
['important-events-body','mood-alternators-body'].forEach(id => {
  const el = document.getElementById(id); if (el) el.style.display = 'none';
});

document.addEventListener("DOMContentLoaded", () => {
  const btnNotify = document.getElementById("btnNotify");
  btnNotify.addEventListener("click", async () => {
    btnNotify.disabled = true;
    btnNotify.textContent = "Enviando...";
    try {
      const response = await fetch("https://danimo-fre6fpbjezcyhxed.canadacentral-01.azurewebsites.net/notification/broadcast", {
        method: "GET"
      });
      if (response.ok) {
        alert("✅ Notificación enviada correctamente.");
      } else {
        alert("⚠️ Error al enviar la notificación.");
      }
    } catch (error) {
      alert("❌ No se pudo conectar con el servidor.");
    } finally {
      btnNotify.disabled = false;
      btnNotify.textContent = "Enviar notificación";
    }
  });
});