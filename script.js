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

const state = {
  type: "line",
  height: 420,
  yMin: "",
  yMax: "",
  xMax: 100,
  points: 5,
  categories: 4,
  startA: 50,
  startB: 35,
  stepA: 10,
  stepB: 8,
  pieA: 38,
  pieB: 26,
  pieC: 20,
  pieD: 16,
  radiusBase: 20,
  radarMax: 100,
  colorA: "#0f62fe",
  colorB: "#24a148",
  colorC: "#8a3ffc",
  colorD: "#ff832b"
};

function toNum(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rangeDates(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    const month = String(i + 1).padStart(2, "0");
    list.push(`2026-${month}-01`);
  }
  return list;
}

function controlsByType(type) {
  const common = [
    { id: "height", title: "Layout", label: "Altura do gráfico (px)", type: "number", value: state.height, helper: "Ex.: 420" },
    { id: "colorA", title: "Cor", label: "Cor série A (HEX)", type: "text", value: state.colorA, helper: "Ex.: #0f62fe" },
    { id: "colorB", title: "Cor", label: "Cor série B (HEX)", type: "text", value: state.colorB, helper: "Ex.: #24a148" }
  ];

  if (type === "line" || type === "area") {
    return [
      ...common,
      { id: "points", title: "Dados", label: "Quantos pontos", type: "number", value: state.points, helper: "De 2 a 10" },
      { id: "startA", title: "Dados", label: "Valor inicial A", type: "number", value: state.startA, helper: "Ponto 1 da série A" },
      { id: "stepA", title: "Dados", label: "Incremento A", type: "number", value: state.stepA, helper: "Quanto cresce por ponto" },
      { id: "startB", title: "Dados", label: "Valor inicial B", type: "number", value: state.startB, helper: "Ponto 1 da série B" },
      { id: "stepB", title: "Dados", label: "Incremento B", type: "number", value: state.stepB, helper: "Quanto cresce por ponto" },
      { id: "yMin", title: "Eixo Y", label: "Y mínimo", type: "number", value: state.yMin, helper: "Vazio = automático" },
      { id: "yMax", title: "Eixo Y", label: "Y máximo", type: "number", value: state.yMax, helper: "Vazio = automático" }
    ];
  }

  if (type === "simple_bar" || type === "grouped_bar" || type === "stacked_bar") {
    const shared = [
      ...common,
      { id: "categories", title: "Dados", label: "Quantas categorias", type: "number", value: state.categories, helper: "De 2 a 8" },
      { id: "yMin", title: "Eixo Y", label: "Y mínimo", type: "number", value: state.yMin, helper: "Vazio = automático" },
      { id: "yMax", title: "Eixo Y", label: "Y máximo", type: "number", value: state.yMax, helper: "Vazio = automático" }
    ];

    if (type === "simple_bar") {
      return [
        ...shared,
        { id: "startA", title: "Dados", label: "Valor inicial", type: "number", value: state.startA, helper: "Barra Q1" },
        { id: "stepA", title: "Dados", label: "Incremento por barra", type: "number", value: state.stepA, helper: "Q2, Q3, Q4..." }
      ];
    }

    return [
      ...shared,
      { id: "startA", title: "Dados", label: "Valor inicial A", type: "number", value: state.startA, helper: "Grupo A na categoria 1" },
      { id: "stepA", title: "Dados", label: "Incremento A", type: "number", value: state.stepA, helper: "Por categoria" },
      { id: "startB", title: "Dados", label: "Valor inicial B", type: "number", value: state.startB, helper: "Grupo B na categoria 1" },
      { id: "stepB", title: "Dados", label: "Incremento B", type: "number", value: state.stepB, helper: "Por categoria" }
    ];
  }

  if (type === "pie" || type === "donut") {
    return [
      ...common,
      { id: "pieA", title: "Fatias", label: "Valor fatia A", type: "number", value: state.pieA, helper: "Produto A" },
      { id: "pieB", title: "Fatias", label: "Valor fatia B", type: "number", value: state.pieB, helper: "Produto B" },
      { id: "pieC", title: "Fatias", label: "Valor fatia C", type: "number", value: state.pieC, helper: "Produto C" },
      { id: "pieD", title: "Fatias", label: "Valor fatia D", type: "number", value: state.pieD, helper: "Produto D" },
      { id: "colorC", title: "Cor", label: "Cor série C (HEX)", type: "text", value: state.colorC, helper: "Ex.: #8a3ffc" },
      { id: "colorD", title: "Cor", label: "Cor série D (HEX)", type: "text", value: state.colorD, helper: "Ex.: #ff832b" }
    ];
  }

  if (type === "scatter" || type === "bubble") {
    const defs = [
      ...common,
      { id: "points", title: "Dados", label: "Quantos pontos", type: "number", value: state.points, helper: "De 3 a 12" },
      { id: "xMax", title: "Eixo X", label: "Eixo X vai até", type: "number", value: state.xMax, helper: "Máximo do eixo X" },
      { id: "yMax", title: "Eixo Y", label: "Eixo Y vai até", type: "number", value: state.yMax || 120, helper: "Máximo do eixo Y" },
      { id: "startA", title: "Dados", label: "Base série A", type: "number", value: state.startA, helper: "Valor inicial série A" },
      { id: "startB", title: "Dados", label: "Base série B", type: "number", value: state.startB, helper: "Valor inicial série B" }
    ];
    if (type === "bubble") {
      defs.push({ id: "radiusBase", title: "Bolhas", label: "Raio base", type: "number", value: state.radiusBase, helper: "Tamanho base das bolhas" });
    }
    return defs;
  }

  return [
    ...common,
    { id: "radarMax", title: "Eixo", label: "Valor máximo do radar", type: "number", value: state.radarMax, helper: "Ex.: 100" },
    { id: "startA", title: "Dados", label: "Base série A", type: "number", value: state.startA, helper: "Pontuação inicial A" },
    { id: "startB", title: "Dados", label: "Base série B", type: "number", value: state.startB, helper: "Pontuação inicial B" },
    { id: "stepA", title: "Dados", label: "Variação A", type: "number", value: state.stepA, helper: "Incremento por critério" },
    { id: "stepB", title: "Dados", label: "Variação B", type: "number", value: state.stepB, helper: "Incremento por critério" }
  ];
}

function createControl(def) {
  return `<cds-text-input id="ctrl-${def.id}" title-text="${def.title}" label="${def.label}" value="${def.value}" helper-text="${def.helper}" type="${def.type}"></cds-text-input>`;
}

function bindControl(def) {
  const node = document.getElementById(`ctrl-${def.id}`);
  if (!node) return;
  const update = () => {
    state[def.id] = node.value;
    renderChart(state.type);
  };
  node.addEventListener("input", update);
  node.addEventListener("change", update);
}

function renderControls(type) {
  if (!controlsHost) return;
  const defs = controlsByType(type);
  controlsHost.innerHTML = defs.map(createControl).join("");
  defs.forEach(bindControl);
}

function buildColorScale(type) {
  const scale = {
    "Produto A": state.colorA || "#0f62fe",
    "Produto B": state.colorB || "#24a148",
    "Produto C": state.colorC || "#8a3ffc",
    "Produto D": state.colorD || "#ff832b"
  };
  if (type === "simple_bar") {
    return { scale: { "Produto A": scale["Produto A"] } };
  }
  return { scale };
}

function buildData(type) {
  const points = clamp(toNum(state.points, 5), 2, 12);
  const categories = clamp(toNum(state.categories, 4), 2, 8);
  const startA = toNum(state.startA, 50);
  const startB = toNum(state.startB, 35);
  const stepA = toNum(state.stepA, 10);
  const stepB = toNum(state.stepB, 8);

  if (type === "line" || type === "area") {
    const dates = rangeDates(points);
    const rows = [];
    dates.forEach((date, idx) => {
      rows.push({ group: "Produto A", date, value: startA + stepA * idx });
      rows.push({ group: "Produto B", date, value: startB + stepB * idx });
    });
    return rows;
  }

  if (type === "simple_bar") {
    return Array.from({ length: categories }, (_, idx) => ({
      group: "Produto A",
      key: `Q${idx + 1}`,
      value: startA + stepA * idx
    }));
  }

  if (type === "grouped_bar" || type === "stacked_bar") {
    const rows = [];
    for (let idx = 0; idx < categories; idx += 1) {
      rows.push({ group: "Produto A", key: `Q${idx + 1}`, value: startA + stepA * idx });
      rows.push({ group: "Produto B", key: `Q${idx + 1}`, value: startB + stepB * idx });
    }
    return rows;
  }

  if (type === "pie" || type === "donut") {
    return [
      { group: "Produto A", value: Math.max(1, toNum(state.pieA, 38)) },
      { group: "Produto B", value: Math.max(1, toNum(state.pieB, 26)) },
      { group: "Produto C", value: Math.max(1, toNum(state.pieC, 20)) },
      { group: "Produto D", value: Math.max(1, toNum(state.pieD, 16)) }
    ];
  }

  if (type === "scatter" || type === "bubble") {
    const xMax = Math.max(10, toNum(state.xMax, 100));
    const yMax = Math.max(10, toNum(state.yMax, 120));
    const rows = [];
    for (let idx = 0; idx < points; idx += 1) {
      const x = Math.round(((idx + 1) / points) * xMax);
      rows.push({ group: "Produto A", x, y: Math.round(startA + (yMax * (idx + 1)) / (points + 1)), value: Math.max(5, toNum(state.radiusBase, 20) + idx * 2) });
      rows.push({ group: "Produto B", x: Math.max(1, x - 5), y: Math.round(startB + (yMax * (idx + 0.7)) / (points + 1)), value: Math.max(5, toNum(state.radiusBase, 20) + idx) });
    }
    return rows;
  }

  const radarMax = Math.max(20, toNum(state.radarMax, 100));
  const features = ["Preço", "Usabilidade", "Performance", "Qualidade", "Suporte"];
  return features.flatMap((feature, idx) => [
    { group: "Produto A", feature, value: clamp(startA + stepA * idx, 0, radarMax) },
    { group: "Produto B", feature, value: clamp(startB + stepB * idx, 0, radarMax) }
  ]);
}

function buildOptions(type) {
  const height = `${Math.max(280, toNum(state.height, 420))}px`;
  const color = buildColorScale(type);
  const yMin = state.yMin === "" ? null : toNum(state.yMin, 0);
  const yMax = state.yMax === "" ? null : toNum(state.yMax, 0);

  const leftAxis = { mapsTo: "value" };
  if (yMin !== null) leftAxis.domainMin = yMin;
  if (yMax !== null) leftAxis.domainMax = yMax;

  if (type === "line" || type === "area") {
    return {
      title: type === "line" ? "Line" : "Area",
      axes: {
        left: { ...leftAxis, title: "Valor" },
        bottom: { mapsTo: "date", scaleType: "time" }
      },
      color,
      height
    };
  }

  if (type === "simple_bar" || type === "grouped_bar" || type === "stacked_bar") {
    return {
      title: type.replace("_", " "),
      axes: {
        left: type === "stacked_bar" ? { ...leftAxis, stacked: true } : leftAxis,
        bottom: { mapsTo: "key", scaleType: "labels" }
      },
      color,
      height
    };
  }

  if (type === "pie") return { title: "Pie", pie: { alignment: "center" }, color, height };
  if (type === "donut") return { title: "Donut", donut: { center: { label: "Total" } }, color, height };

  if (type === "scatter") {
    return {
      title: "Scatter",
      axes: {
        left: { mapsTo: "y" },
        bottom: { mapsTo: "x", scaleType: "linear", domainMax: Math.max(10, toNum(state.xMax, 100)) }
      },
      color,
      height
    };
  }

  if (type === "bubble") {
    return {
      title: "Bubble",
      axes: {
        left: { mapsTo: "y" },
        bottom: { mapsTo: "x", scaleType: "linear", domainMax: Math.max(10, toNum(state.xMax, 100)) }
      },
      bubble: { radiusMapsTo: "value" },
      color,
      height
    };
  }

  return {
    title: "Radar",
    radar: {
      axes: {
        angle: "feature",
        value: "value"
      }
    },
    color,
    height
  };
}

function renderChart(type) {
  if (!chartHolder) return;
  const charts = window.Charts || window.CarbonCharts;
  if (!charts) {
    chartHolder.innerHTML = "<p>Erro: Carbon Charts não carregou.</p>";
    return;
  }

  const ChartCtor = charts[chartClassMap[type]];
  if (!ChartCtor) {
    chartHolder.innerHTML = "<p>Erro: tipo de gráfico indisponível.</p>";
    return;
  }

  state.type = type;
  chartHolder.innerHTML = "";
  new ChartCtor(chartHolder, {
    data: buildData(type),
    options: buildOptions(type)
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
      renderControls(value);
      renderChart(value);
    }
  });
}

bindSideNav();
bindSideNavSubmenus();
renderControls("line");
renderChart("line");
