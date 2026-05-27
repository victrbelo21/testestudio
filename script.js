const chartHolder = document.getElementById("chart-container");
const chartSelector = document.getElementById("chart-selector");
const controlsHost = document.getElementById("chart-controls");

const sideNav = document.getElementById("side-nav");
const sideNavOverlay = document.getElementById("side-nav-overlay");
const sideNavToggle = document.getElementById("header-menu-toggle");
const sideNavSubmenus = document.querySelectorAll(".cds--side-nav__submenu");
const desktopMedia = window.matchMedia("(min-width: 1056px)");

const chartClassMap = {
  line: "LineChart",
  area: "AreaChart",
  simple_bar: "SimpleBarChart",
  grouped_bar: "GroupedBarChart",
  stacked_bar: "StackedBarChart",
  pie: "PieChart",
  donut: "DonutChart",
  scatter: "ScatterChart",
  bubble: "BubbleChart",
  radar: "RadarChart"
};

const palette = [
  ["Red 100", "#2d0709"], ["Red 90", "#520408"], ["Red 80", "#750e13"], ["Red 70", "#a2191f"], ["Red 60", "#da1e28"], ["Red 50", "#fa4d56"], ["Red 40", "#ff8389"], ["Red 30", "#ffb3b8"], ["Red 20", "#ffd7d9"], ["Red 10", "#fff1f1"],
  ["Magenta 100", "#2a0a18"], ["Magenta 90", "#510224"], ["Magenta 80", "#740937"], ["Magenta 70", "#9f1853"], ["Magenta 60", "#d02670"], ["Magenta 50", "#ee5396"], ["Magenta 40", "#ff7eb6"], ["Magenta 30", "#ffafd2"], ["Magenta 20", "#ffd6e8"], ["Magenta 10", "#fff0f7"],
  ["Purple 100", "#1c0f30"], ["Purple 90", "#31135e"], ["Purple 80", "#491d8b"], ["Purple 70", "#6929c4"], ["Purple 60", "#8a3ffc"], ["Purple 50", "#a56eff"], ["Purple 40", "#be95ff"], ["Purple 30", "#d4bbff"], ["Purple 20", "#e8daff"], ["Purple 10", "#f6f2ff"],
  ["Blue 100", "#001141"], ["Blue 90", "#001d6c"], ["Blue 80", "#002d9c"], ["Blue 70", "#0043ce"], ["Blue 60", "#0f62fe"], ["Blue 50", "#4589ff"], ["Blue 40", "#78a9ff"], ["Blue 30", "#a6c8ff"], ["Blue 20", "#d0e2ff"], ["Blue 10", "#edf5ff"],
  ["Cyan 100", "#061727"], ["Cyan 90", "#012749"], ["Cyan 80", "#003a6d"], ["Cyan 70", "#00539a"], ["Cyan 60", "#0072c3"], ["Cyan 50", "#1192e8"], ["Cyan 40", "#33b1ff"], ["Cyan 30", "#82cfff"], ["Cyan 20", "#bae6ff"], ["Cyan 10", "#e5f6ff"],
  ["Teal 100", "#081a1c"], ["Teal 90", "#022b30"], ["Teal 80", "#004144"], ["Teal 70", "#005d5d"], ["Teal 60", "#007d79"], ["Teal 50", "#009d9a"], ["Teal 40", "#08bdba"], ["Teal 30", "#3ddbd9"], ["Teal 20", "#9ef0f0"], ["Teal 10", "#d9fbfb"],
  ["Green 100", "#071908"], ["Green 90", "#022d0d"], ["Green 80", "#044317"], ["Green 70", "#0e6027"], ["Green 60", "#198038"], ["Green 50", "#24a148"], ["Green 40", "#42be65"], ["Green 30", "#6fdc8c"], ["Green 20", "#a7f0ba"], ["Green 10", "#defbe6"],
  ["Cool Gray 100", "#121619"], ["Cool Gray 90", "#21272a"], ["Cool Gray 80", "#343a3f"], ["Cool Gray 70", "#4d5358"], ["Cool Gray 60", "#697077"], ["Cool Gray 50", "#878d96"], ["Cool Gray 40", "#a2a9b0"], ["Cool Gray 30", "#c1c7cd"], ["Cool Gray 20", "#dde1e6"], ["Cool Gray 10", "#f2f4f8"],
  ["Gray 100", "#161616"], ["Gray 90", "#262626"], ["Gray 80", "#393939"], ["Gray 70", "#525252"], ["Gray 60", "#6f6f6f"], ["Gray 50", "#8d8d8d"], ["Gray 40", "#a8a8a8"], ["Gray 30", "#c6c6c6"], ["Gray 20", "#e0e0e0"], ["Gray 10", "#f4f4f4"],
  ["Warm Gray 100", "#171414"], ["Warm Gray 90", "#272525"], ["Warm Gray 80", "#3c3838"], ["Warm Gray 70", "#565151"], ["Warm Gray 60", "#726e6e"], ["Warm Gray 50", "#8f8b8b"], ["Warm Gray 40", "#ada8a8"], ["Warm Gray 30", "#cac5c4"], ["Warm Gray 20", "#e5e0df"], ["Warm Gray 10", "#f7f3f2"],
  ["Black", "#000000"], ["White", "#ffffff"], ["Alert 60", "#da1e28"], ["Alert 50", "#24a148"], ["Alert 40", "#ff832b"], ["Alert 30", "#f1c21b"]
];
const paletteMap = Object.fromEntries(palette);

const state = {
  type: "line",
  yMin: 0,
  yMax: 999999,
  xMode: "text",
  xMax: 100,
  textCols: 3,
  colNames: ["Coluna 1", "Coluna 2", "Coluna 3", "Coluna 4", "Coluna 5", "Coluna 6", "Coluna 7", "Coluna 8", "Coluna 9", "Coluna 10", "Coluna 11", "Coluna 12"],
  seriesCount: 2,
  productNames: ["Produto 1", "Produto 2", "Produto 3", "Produto 4", "Produto 5"],
  seriesColors: ["Blue 60", "Green 50", "Purple 60", "Red 60", "Teal 50"],
  values: Array.from({ length: 5 }, () => Array.from({ length: 12 }, (_, i) => (i + 1) * 10)),
  bubbleRadius: 20,
  pieMode: "value"
};

function n(v, f = 0) {
  const x = Number(v);
  return Number.isFinite(x) ? x : f;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function buildColorScale() {
  const scale = {};
  for (let i = 0; i < state.seriesCount; i += 1) {
    scale[state.productNames[i] || `Produto ${i + 1}`] = paletteMap[state.seriesColors[i]] || "#0f62fe";
  }
  return { scale };
}

function dropdownItems(options) {
  return options.map((o) => `<cds-dropdown-item value="${o}">${o}</cds-dropdown-item>`).join("");
}

function mkSlider(id, label, value, min, max) {
  return `<div class="control-box"><cds-slider id="${id}" label-text="${label}" min="${min}" max="${max}" step="1" value="${value}"><cds-slider-input aria-label="${label}" type="number"></cds-slider-input></cds-slider></div>`;
}

function mkText(id, label, value, compact = false, type = "number") {
  return `<div class="control-box ${compact ? "series-value-input" : ""}"><cds-text-input id="${id}" title-text="${label}" label="${label}" value="${value}" type="${type}"></cds-text-input></div>`;
}

function mkDropdown(id, label, value, options) {
  return `<div class="control-box"><cds-dropdown id="${id}" title-text="${label}" label="${label}" value="${value}">${dropdownItems(options)}</cds-dropdown></div>`;
}

function renderControls() {
  const isLine = state.type === "line";
  const isBubble = state.type === "bubble";
  const isPie = state.type === "pie" || state.type === "donut";

  let html = "";

  if (isLine) {
    html += `<section class="conditional-group"><h3 class="conditional-title">Eixos</h3>${mkSlider("y-min", "Eixo Y mínimo", state.yMin, 0, 999999)}${mkSlider("y-max", "Eixo Y máximo", state.yMax, 0, 999999)}${mkDropdown("x-mode", "Tipo do eixo X", state.xMode, ["text", "number"])}`;
    if (state.xMode === "number") {
      html += mkSlider("x-max", "Eixo X máximo", state.xMax, 0, Math.max(999999, state.xMax + 1000));
    } else {
      html += mkSlider("text-cols", "Quantidade de colunas", state.textCols, 1, 12);
      for (let c = 0; c < state.textCols; c += 1) {
        html += mkText(`col-name-${c}`, `Nome da coluna ${c + 1}`, state.colNames[c], false, "text");
      }
    }
    html += `</section>`;

    html += `<section class="conditional-group"><h3 class="conditional-title">Séries</h3>${mkSlider("series-count", "Quantidade de séries", state.seriesCount, 1, 5)}`;
    for (let s = 0; s < state.seriesCount; s += 1) {
      html += mkText(`prod-name-${s}`, `Nome do produto ${s + 1}`, state.productNames[s], false, "text");
      html += mkDropdown(`prod-color-${s}`, `Cor do produto ${s + 1}`, state.seriesColors[s], palette.map((p) => p[0]));
      html += `<div class="series-values">`;
      const pcount = state.xMode === "text" ? state.textCols : 3;
      for (let p = 0; p < pcount; p += 1) {
        html += mkText(`v-${s}-${p}`, `Série ${s + 1}, ponto ${p + 1}`, state.values[s][p], true, "number");
      }
      html += `</div>`;
    }
    html += `</section>`;
  } else {
    html += `<section class="conditional-group"><h3 class="conditional-title">Configuração</h3>${mkSlider("series-count", "Quantidade de séries", state.seriesCount, 1, 5)}${mkSlider("y-min", "Eixo Y mínimo", state.yMin, 0, 999999)}${mkSlider("y-max", "Eixo Y máximo", state.yMax, 0, 999999)}`;
    if (isBubble) html += mkSlider("bubble-radius", "Radius das bolhas", state.bubbleRadius, 1, 200);
    if (isPie) html += mkDropdown("pie-mode", "Exibição da pizza", state.pieMode, ["value", "percent"]);
    html += `</section>`;
  }

  controlsHost.innerHTML = html;
  bindControls();
}

function onSlider(id, fn) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("cds-slider-changed", () => fn(n(el.value, 0)));
}

function onDropdown(id, fn) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("cds-dropdown-selected", (e) => fn(e?.detail?.item?.value));
}

function onInput(id, fn) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("input", () => fn(el.value));
}

function bindControls() {
  onSlider("y-min", (v) => { state.yMin = clamp(v, 0, 999999); if (state.yMax < state.yMin) state.yMax = state.yMin; renderChart(); });
  onSlider("y-max", (v) => { state.yMax = clamp(v, state.yMin, 999999); renderChart(); });
  onSlider("series-count", (v) => { state.seriesCount = clamp(v, 1, 5); renderControls(); renderChart(); });

  if (state.type === "line") {
    onDropdown("x-mode", (v) => { state.xMode = v; renderControls(); renderChart(); });

    if (state.xMode === "number") {
      onSlider("x-max", (v) => { state.xMax = Math.max(0, v); renderChart(); });
    } else {
      onSlider("text-cols", (v) => { state.textCols = clamp(v, 1, 12); renderControls(); renderChart(); });
      for (let c = 0; c < state.textCols; c += 1) onInput(`col-name-${c}`, (v) => { state.colNames[c] = v || `Coluna ${c + 1}`; renderChart(); });
    }

    const pcount = state.xMode === "text" ? state.textCols : 3;
    for (let s = 0; s < state.seriesCount; s += 1) {
      onInput(`prod-name-${s}`, (v) => { state.productNames[s] = v || `Produto ${s + 1}`; renderChart(); });
      onDropdown(`prod-color-${s}`, (v) => { state.seriesColors[s] = v; renderChart(); });
      for (let p = 0; p < pcount; p += 1) onInput(`v-${s}-${p}`, (v) => { state.values[s][p] = n(v, 0); renderChart(); });
    }
  }

  if (state.type === "bubble") onSlider("bubble-radius", (v) => { state.bubbleRadius = Math.max(1, v); renderChart(); });
  if (state.type === "pie" || state.type === "donut") onDropdown("pie-mode", (v) => { state.pieMode = v; renderChart(); });
}

function lineData() {
  const rows = [];
  const points = state.xMode === "text" ? state.textCols : 3;
  for (let s = 0; s < state.seriesCount; s += 1) {
    const group = state.productNames[s] || `Produto ${s + 1}`;
    for (let p = 0; p < points; p += 1) {
      const value = n(state.values[s][p], 0);
      if (state.xMode === "number") {
        const x = points === 1 ? state.xMax : Math.round((p / (points - 1)) * state.xMax);
        rows.push({ group, key: x, value });
      } else {
        rows.push({ group, key: state.colNames[p] || `Coluna ${p + 1}`, value });
      }
    }
  }
  return rows;
}

function fallbackData() {
  const groups = Array.from({ length: state.seriesCount }, (_, i) => state.productNames[i] || `Produto ${i + 1}`);
  if (state.type === "pie" || state.type === "donut") {
    const raw = groups.map((g, i) => ({ group: g, value: Math.max(1, n(state.values[i][0], 10)) }));
    if (state.pieMode === "percent") {
      const total = raw.reduce((a, b) => a + b.value, 0);
      return raw.map((r) => ({ ...r, value: Math.round((r.value / total) * 100) }));
    }
    return raw;
  }
  if (state.type === "bubble") return groups.map((g, i) => ({ group: g, x: i * 10 + 10, y: Math.max(1, n(state.values[i][0], 10)), value: state.bubbleRadius }));
  if (state.type === "scatter") return groups.map((g, i) => ({ group: g, x: i * 10 + 10, y: Math.max(1, n(state.values[i][0], 10)) }));
  if (state.type === "radar") return groups.flatMap((g, i) => ["A", "B", "C"].map((f, k) => ({ group: g, feature: f, value: Math.max(1, n(state.values[i][k] ?? 10, 10)) })));
  return groups.map((g, i) => ({ group: g, key: "P1", value: Math.max(1, n(state.values[i][0], 10)) }));
}

function buildOptions() {
  const color = buildColorScale();
  if (state.type === "line") {
    return {
      title: "Line",
      axes: {
        left: { mapsTo: "value", domainMin: state.yMin, domainMax: state.yMax },
        bottom: state.xMode === "number" ? { mapsTo: "key", scaleType: "linear", domainMin: 0, domainMax: state.xMax } : { mapsTo: "key", scaleType: "labels" }
      },
      color,
      height: "420px"
    };
  }
  if (state.type === "pie") return { title: "Pie", pie: { alignment: "center" }, color, height: "420px" };
  if (state.type === "donut") return { title: "Donut", donut: { center: { label: state.pieMode === "percent" ? "%" : "Valor" } }, color, height: "420px" };
  if (state.type === "bubble") return { title: "Bubble", axes: { left: { mapsTo: "y" }, bottom: { mapsTo: "x", scaleType: "linear" } }, bubble: { radiusMapsTo: "value" }, color, height: "420px" };
  if (state.type === "scatter") return { title: "Scatter", axes: { left: { mapsTo: "y" }, bottom: { mapsTo: "x", scaleType: "linear" } }, color, height: "420px" };
  if (state.type === "radar") return { title: "Radar", radar: { axes: { angle: "feature", value: "value" } }, color, height: "420px" };
  return { title: state.type.replace("_", " "), axes: { left: { mapsTo: "value", stacked: state.type === "stacked_bar" }, bottom: { mapsTo: "key", scaleType: "labels" } }, color, height: "420px" };
}

function renderChart() {
  const charts = window.Charts || window.CarbonCharts;
  if (!charts || !chartHolder) return;
  const Ctor = charts[chartClassMap[state.type]];
  if (!Ctor) return;
  const data = state.type === "line" ? lineData() : fallbackData();
  chartHolder.innerHTML = "";
  new Ctor(chartHolder, { data, options: buildOptions() });
}

function setSideNavOpen(isOpen) {
  if (!sideNav || !sideNavOverlay || !sideNavToggle) return;
  sideNav.classList.toggle("is-open", isOpen);
  sideNav.setAttribute("aria-hidden", String(!isOpen));
  sideNavToggle.setAttribute("aria-expanded", String(isOpen));
  sideNavOverlay.hidden = desktopMedia.matches || !isOpen;
}

function bindSideNav() {
  if (!sideNav || !sideNavOverlay || !sideNavToggle) return;
  sideNavToggle.addEventListener("click", () => setSideNavOpen(!sideNav.classList.contains("is-open")));
  sideNavOverlay.addEventListener("click", () => setSideNavOpen(false));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setSideNavOpen(false); });
  desktopMedia.addEventListener("change", () => {
    if (desktopMedia.matches && !sideNav.classList.contains("is-open")) setSideNavOpen(true);
    if (!desktopMedia.matches) setSideNavOpen(false);
  });
  setSideNavOpen(desktopMedia.matches);
}

function bindSideNavSubmenus() {
  sideNavSubmenus.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".cds--side-nav__item");
      if (!item) return;
      const willOpen = !item.classList.contains("is-open");
      item.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });
}

if (chartSelector) {
  chartSelector.addEventListener("cds-dropdown-selected", (event) => {
    const value = event?.detail?.item?.value;
    if (value && chartClassMap[value]) {
      state.type = value;
      renderControls();
      renderChart();
    }
  });
}

bindSideNav();
bindSideNavSubmenus();
renderControls();
renderChart();
