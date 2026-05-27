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
  ["red 100", "#2d0709"], ["red 90", "#520408"], ["red 80", "#750e13"], ["red 70", "#a2191f"], ["red 60", "#da1e28"], ["red 50", "#fa4d56"], ["red 40", "#ff8389"], ["red 30", "#ffb3b8"], ["red 20", "#ffd7d9"], ["red 10", "#fff1f1"],
  ["magenta 100", "#2a0a18"], ["magenta 90", "#510224"], ["magenta 80", "#740937"], ["magenta 70", "#9f1853"], ["magenta 60", "#d02670"], ["magenta 50", "#ee5396"], ["magenta 40", "#ff7eb6"], ["magenta 30", "#ffafd2"], ["magenta 20", "#ffd6e8"], ["magenta 10", "#fff0f7"],
  ["purple 100", "#1c0f30"], ["purple 90", "#31135e"], ["purple 80", "#491d8b"], ["purple 70", "#6929c4"], ["purple 60", "#8a3ffc"], ["purple 50", "#a56eff"], ["purple 40", "#be95ff"], ["purple 30", "#d4bbff"], ["purple 20", "#e8daff"], ["purple 10", "#f6f2ff"],
  ["blue 100", "#001141"], ["blue 90", "#001d6c"], ["blue 80", "#002d9c"], ["blue 70", "#0043ce"], ["blue 60", "#0f62fe"], ["blue 50", "#4589ff"], ["blue 40", "#78a9ff"], ["blue 30", "#a6c8ff"], ["blue 20", "#d0e2ff"], ["blue 10", "#edf5ff"],
  ["cyan 100", "#061727"], ["cyan 90", "#012749"], ["cyan 80", "#003a6d"], ["cyan 70", "#00539a"], ["cyan 60", "#0072c3"], ["cyan 50", "#1192e8"], ["cyan 40", "#33b1ff"], ["cyan 30", "#82cfff"], ["cyan 20", "#bae6ff"], ["cyan 10", "#e5f6ff"],
  ["teal 100", "#081a1c"], ["teal 90", "#022b30"], ["teal 80", "#004144"], ["teal 70", "#005d5d"], ["teal 60", "#007d79"], ["teal 50", "#009d9a"], ["teal 40", "#08bdba"], ["teal 30", "#3ddbd9"], ["teal 20", "#9ef0f0"], ["teal 10", "#d9fbfb"],
  ["green 100", "#071908"], ["green 90", "#022d0d"], ["green 80", "#044317"], ["green 70", "#0e6027"], ["green 60", "#198038"], ["green 50", "#24a148"], ["green 40", "#42be65"], ["green 30", "#6fdc8c"], ["green 20", "#a7f0ba"], ["green 10", "#defbe6"],
  ["cool gray 100", "#121619"], ["cool gray 90", "#21272a"], ["cool gray 80", "#343a3f"], ["cool gray 70", "#4d5358"], ["cool gray 60", "#697077"], ["cool gray 50", "#878d96"], ["cool gray 40", "#a2a9b0"], ["cool gray 30", "#c1c7cd"], ["cool gray 20", "#dde1e6"], ["cool gray 10", "#f2f4f8"],
  ["gray 100", "#161616"], ["gray 90", "#262626"], ["gray 80", "#393939"], ["gray 70", "#525252"], ["gray 60", "#6f6f6f"], ["gray 50", "#8d8d8d"], ["gray 40", "#a8a8a8"], ["gray 30", "#c6c6c6"], ["gray 20", "#e0e0e0"], ["gray 10", "#f4f4f4"],
  ["warm gray 100", "#171414"], ["warm gray 90", "#272525"], ["warm gray 80", "#3c3838"], ["warm gray 70", "#565151"], ["warm gray 60", "#726e6e"], ["warm gray 50", "#8f8b8b"], ["warm gray 40", "#ada8a8"], ["warm gray 30", "#cac5c4"], ["warm gray 20", "#e5e0df"], ["warm gray 10", "#f7f3f2"],
  ["black", "#000000"], ["white", "#ffffff"],
  ["alert 60", "#da1e28"], ["alert 50", "#24a148"], ["alert 40", "#ff832b"], ["alert 30", "#f1c21b"]
];

const state = {
  type: "line",
  seriesCount: 2,
  pointCount: 3,
  productNames: ["Produto A", "Produto B", "Produto C", "Produto D"],
  seriesColors: ["blue 60", "green 50", "purple 60", "red 60"],
  xMode: "text",
  xMax: 100,
  yMin: 0,
  yMax: 100,
  values: [[30, 55, 72], [20, 44, 61], [10, 20, 40], [5, 10, 15]],
  pieValues: [38, 26, 20, 16]
};

const paletteMap = Object.fromEntries(palette);

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function toNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function ensureMatrix() {
  for (let s = 0; s < 4; s += 1) {
    if (!state.values[s]) state.values[s] = [];
    for (let p = 0; p < state.pointCount; p += 1) {
      if (state.values[s][p] == null) state.values[s][p] = 10 + s * 5 + p * 10;
    }
  }
}

function selectOptions() {
  return palette.map(([name]) => `<option value="${name}">${name}</option>`).join("");
}

function controlInput(label, id, value, type = "number") {
  return `<div class="control-box"><label class="control-label" for="${id}">${label}</label><input class="control-input" id="${id}" type="${type}" value="${value}"></div>`;
}

function controlSelect(label, id, value, optionsHtml) {
  return `<div class="control-box"><label class="control-label" for="${id}">${label}</label><select class="control-select" id="${id}">${optionsHtml}</select></div>`.replace(`value=\"${value}\"`, "");
}

function controlSlider(label, id, value, min = 0, max = 1000, step = 1) {
  return `<div class="control-box"><label class="control-label" for="${id}">${label}</label><div class="range-wrap"><input class="control-range" id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><input class="control-input" id="${id}-num" type="number" value="${value}"></div></div>`;
}

function setSelectValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function renderControls() {
  ensureMatrix();
  const isPie = state.type === "pie" || state.type === "donut";
  const isCartesian = ["line", "area", "simple_bar", "grouped_bar", "stacked_bar", "scatter", "bubble"].includes(state.type);

  let html = "";
  html += controlSlider("Eixo Y mínimo", "y-min", state.yMin, 0, 1000, 1);
  html += controlSlider("Eixo Y máximo", "y-max", state.yMax, 1, 5000, 1);

  if (isCartesian) {
    html += `<div class="control-box"><label class="control-label" for="x-mode">Tipo do eixo X</label><select class="control-select" id="x-mode"><option value="text">Texto</option><option value="number">Número</option></select></div>`;
    if (state.xMode === "number") {
      html += controlSlider("Eixo X vai até", "x-max", state.xMax, 0, Math.max(1000, state.xMax * 2), 1);
    }
  }

  html += controlSlider("Quantidade de séries", "series-count", state.seriesCount, 1, 4, 1);

  if (!isPie) {
    html += controlSlider("Quantidade de pontos", "point-count", state.pointCount, 1, 12, 1);
  }

  for (let s = 0; s < state.seriesCount; s += 1) {
    html += controlInput(`Nome do produto ${s + 1}`, `prod-name-${s}`, state.productNames[s], "text");
    html += `<div class="control-box"><label class="control-label" for="prod-color-${s}">Cor do produto ${s + 1}</label><select class="control-select" id="prod-color-${s}">${selectOptions()}</select></div>`;

    if (isPie) {
      html += controlInput(`Valor do produto ${s + 1}`, `pie-value-${s}`, state.pieValues[s], "number");
    } else {
      for (let p = 0; p < state.pointCount; p += 1) {
        html += controlInput(`Série ${s + 1}, ponto ${p + 1}`, `val-${s}-${p}`, state.values[s][p], "number");
      }
    }
  }

  controlsHost.innerHTML = html;

  setSelectValue("x-mode", state.xMode);
  for (let s = 0; s < state.seriesCount; s += 1) {
    setSelectValue(`prod-color-${s}`, state.seriesColors[s]);
  }

  bindControls();
}

function bindSliderPair(id, cb) {
  const range = document.getElementById(id);
  const num = document.getElementById(`${id}-num`);
  if (!range || !num) return;

  const sync = (value) => {
    if (id === "x-max" && Number(value) >= Number(range.max)) {
      range.max = String(Number(value) * 2 + 100);
    }
    range.value = value;
    num.value = value;
    cb(Number(value));
  };

  range.addEventListener("input", () => sync(range.value));
  num.addEventListener("input", () => sync(num.value));
}

function bindControls() {
  bindSliderPair("y-min", (v) => {
    state.yMin = v;
    if (state.yMax <= state.yMin) state.yMax = state.yMin + 1;
    renderChart();
  });

  bindSliderPair("y-max", (v) => {
    state.yMax = Math.max(v, state.yMin + 1);
    renderChart();
  });

  bindSliderPair("series-count", (v) => {
    state.seriesCount = clamp(v, 1, 4);
    renderControls();
    renderChart();
  });

  const pointRange = document.getElementById("point-count");
  const pointNum = document.getElementById("point-count-num");
  if (pointRange && pointNum) {
    const fn = (value) => {
      state.pointCount = clamp(Number(value), 1, 12);
      renderControls();
      renderChart();
    };
    pointRange.addEventListener("input", () => fn(pointRange.value));
    pointNum.addEventListener("input", () => fn(pointNum.value));
  }

  if (state.xMode === "number") {
    bindSliderPair("x-max", (v) => {
      state.xMax = Math.max(0, v);
      renderChart();
    });
  }

  const xMode = document.getElementById("x-mode");
  if (xMode) {
    xMode.addEventListener("change", () => {
      state.xMode = xMode.value;
      renderControls();
      renderChart();
    });
  }

  for (let s = 0; s < state.seriesCount; s += 1) {
    const name = document.getElementById(`prod-name-${s}`);
    const color = document.getElementById(`prod-color-${s}`);
    if (name) name.addEventListener("input", () => {
      state.productNames[s] = name.value || `Produto ${s + 1}`;
      renderChart();
    });
    if (color) color.addEventListener("change", () => {
      state.seriesColors[s] = color.value;
      renderChart();
    });

    if (state.type === "pie" || state.type === "donut") {
      const pieVal = document.getElementById(`pie-value-${s}`);
      if (pieVal) pieVal.addEventListener("input", () => {
        state.pieValues[s] = Math.max(1, toNum(pieVal.value, 1));
        renderChart();
      });
    } else {
      for (let p = 0; p < state.pointCount; p += 1) {
        const v = document.getElementById(`val-${s}-${p}`);
        if (v) {
          v.addEventListener("input", () => {
            state.values[s][p] = toNum(v.value, 0);
            renderChart();
          });
        }
      }
    }
  }
}

function buildColorScale() {
  const scale = {};
  for (let s = 0; s < state.seriesCount; s += 1) {
    const name = state.productNames[s] || `Produto ${s + 1}`;
    const token = state.seriesColors[s] || "blue 60";
    scale[name] = paletteMap[token] || "#0f62fe";
  }
  return { scale };
}

function buildData() {
  const data = [];
  const xNumeric = state.xMode === "number";

  if (state.type === "pie" || state.type === "donut") {
    for (let s = 0; s < state.seriesCount; s += 1) {
      data.push({
        group: state.productNames[s] || `Produto ${s + 1}`,
        value: Math.max(1, toNum(state.pieValues[s], 1))
      });
    }
    return data;
  }

  for (let s = 0; s < state.seriesCount; s += 1) {
    const group = state.productNames[s] || `Produto ${s + 1}`;
    for (let p = 0; p < state.pointCount; p += 1) {
      const value = toNum(state.values[s][p], 0);
      const label = `P${p + 1}`;
      const xValue = state.pointCount === 1 ? state.xMax : Math.round((p / (state.pointCount - 1)) * state.xMax);

      if (state.type === "line" || state.type === "area") {
        data.push(xNumeric ? { group, key: xValue, value } : { group, key: label, value });
      } else if (state.type === "simple_bar" || state.type === "grouped_bar" || state.type === "stacked_bar") {
        data.push({ group, key: xNumeric ? String(xValue) : label, value });
      } else if (state.type === "scatter") {
        data.push({ group, x: xValue, y: value });
      } else if (state.type === "bubble") {
        data.push({ group, x: xValue, y: value, value: Math.max(5, Math.round(value / 3)) });
      } else if (state.type === "radar") {
        data.push({ group, feature: label, value });
      }
    }
  }

  return data;
}

function buildOptions() {
  const color = buildColorScale();

  if (state.type === "line" || state.type === "area") {
    return {
      title: state.type === "line" ? "Line" : "Area",
      axes: {
        left: { mapsTo: "value", domainMin: state.yMin, domainMax: state.yMax, title: "Valor" },
        bottom: state.xMode === "number" ? { mapsTo: "key", scaleType: "linear", domainMin: 0, domainMax: state.xMax } : { mapsTo: "key", scaleType: "labels" }
      },
      data: { groupMapsTo: "group" },
      color,
      height: "420px"
    };
  }

  if (state.type === "simple_bar" || state.type === "grouped_bar" || state.type === "stacked_bar") {
    return {
      title: state.type.replace("_", " "),
      axes: {
        left: { mapsTo: "value", domainMin: state.yMin, domainMax: state.yMax, stacked: state.type === "stacked_bar" },
        bottom: { mapsTo: "key", scaleType: "labels" }
      },
      color,
      height: "420px"
    };
  }

  if (state.type === "pie") return { title: "Pie", pie: { alignment: "center" }, color, height: "420px" };
  if (state.type === "donut") return { title: "Donut", donut: { center: { label: "Total" } }, color, height: "420px" };

  if (state.type === "scatter") {
    return {
      title: "Scatter",
      axes: {
        left: { mapsTo: "y", domainMin: state.yMin, domainMax: state.yMax },
        bottom: { mapsTo: "x", scaleType: "linear", domainMin: 0, domainMax: state.xMax }
      },
      color,
      height: "420px"
    };
  }

  if (state.type === "bubble") {
    return {
      title: "Bubble",
      axes: {
        left: { mapsTo: "y", domainMin: state.yMin, domainMax: state.yMax },
        bottom: { mapsTo: "x", scaleType: "linear", domainMin: 0, domainMax: state.xMax }
      },
      bubble: { radiusMapsTo: "value" },
      color,
      height: "420px"
    };
  }

  return {
    title: "Radar",
    radar: { axes: { angle: "feature", value: "value" } },
    color,
    height: "420px"
  };
}

function renderChart() {
  const charts = window.Charts || window.CarbonCharts;
  if (!charts || !chartHolder) {
    return;
  }

  const ChartCtor = charts[chartClassMap[state.type]];
  if (!ChartCtor) {
    return;
  }

  chartHolder.innerHTML = "";
  new ChartCtor(chartHolder, {
    data: buildData(),
    options: buildOptions()
  });
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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSideNavOpen(false);
  });
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
