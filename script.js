const chartHolder = document.getElementById("chart-container");
const chartSelector = document.getElementById("chart-selector");
const controlsHost = document.getElementById("chart-controls");

const sideNav = document.getElementById("side-nav");
const sideNavOverlay = document.getElementById("side-nav-overlay");
const sideNavToggle = document.getElementById("header-menu-toggle");
const sideNavSubmenus = document.querySelectorAll(".cds--side-nav__submenu");

const desktopMedia = window.matchMedia("(min-width: 1056px)");

const baseDataCatalog = {
  line: [
    { group: "Produto A", date: "2026-01-01", value: 65000 },
    { group: "Produto A", date: "2026-02-01", value: 69000 },
    { group: "Produto A", date: "2026-03-01", value: 70000 },
    { group: "Produto B", date: "2026-01-01", value: 52000 },
    { group: "Produto B", date: "2026-02-01", value: 56000 },
    { group: "Produto B", date: "2026-03-01", value: 61000 }
  ],
  area: [
    { group: "Produto A", date: "2026-01-01", value: 12000 },
    { group: "Produto A", date: "2026-02-01", value: 17000 },
    { group: "Produto A", date: "2026-03-01", value: 16000 },
    { group: "Produto B", date: "2026-01-01", value: 10000 },
    { group: "Produto B", date: "2026-02-01", value: 14000 },
    { group: "Produto B", date: "2026-03-01", value: 15500 }
  ],
  simple_bar: [
    { group: "Produto A", key: "Q1", value: 38000 },
    { group: "Produto A", key: "Q2", value: 42000 },
    { group: "Produto A", key: "Q3", value: 47000 },
    { group: "Produto A", key: "Q4", value: 52000 }
  ],
  grouped_bar: [
    { group: "Produto A", key: "Q1", value: 38000 },
    { group: "Produto B", key: "Q1", value: 33000 },
    { group: "Produto A", key: "Q2", value: 42000 },
    { group: "Produto B", key: "Q2", value: 36000 },
    { group: "Produto A", key: "Q3", value: 47000 },
    { group: "Produto B", key: "Q3", value: 39000 },
    { group: "Produto A", key: "Q4", value: 52000 },
    { group: "Produto B", key: "Q4", value: 44000 }
  ],
  stacked_bar: [
    { group: "Produto A", key: "Q1", value: 12000 },
    { group: "Produto B", key: "Q1", value: 9000 },
    { group: "Produto A", key: "Q2", value: 15000 },
    { group: "Produto B", key: "Q2", value: 11000 },
    { group: "Produto A", key: "Q3", value: 17000 },
    { group: "Produto B", key: "Q3", value: 13000 },
    { group: "Produto A", key: "Q4", value: 19000 },
    { group: "Produto B", key: "Q4", value: 16000 }
  ],
  pie: [
    { group: "Produto A", value: 38 },
    { group: "Produto B", value: 26 },
    { group: "Produto C", value: 20 },
    { group: "Produto D", value: 16 }
  ],
  donut: [
    { group: "Produto A", value: 38 },
    { group: "Produto B", value: 26 },
    { group: "Produto C", value: 20 },
    { group: "Produto D", value: 16 }
  ],
  scatter: [
    { group: "Produto A", x: 10, y: 12000 },
    { group: "Produto A", x: 20, y: 18000 },
    { group: "Produto A", x: 30, y: 23000 },
    { group: "Produto B", x: 12, y: 10000 },
    { group: "Produto B", x: 22, y: 14500 },
    { group: "Produto B", x: 32, y: 21000 }
  ],
  bubble: [
    { group: "Produto A", x: 12, y: 15000, value: 35 },
    { group: "Produto A", x: 20, y: 23000, value: 22 },
    { group: "Produto B", x: 16, y: 17000, value: 28 },
    { group: "Produto B", x: 28, y: 26000, value: 18 }
  ],
  radar: [
    { group: "Produto A", feature: "Preco", value: 72 },
    { group: "Produto A", feature: "Usabilidade", value: 88 },
    { group: "Produto A", feature: "Performance", value: 79 },
    { group: "Produto A", feature: "Qualidade", value: 91 },
    { group: "Produto A", feature: "Suporte", value: 67 },
    { group: "Produto B", feature: "Preco", value: 63 },
    { group: "Produto B", feature: "Usabilidade", value: 77 },
    { group: "Produto B", feature: "Performance", value: 85 },
    { group: "Produto B", feature: "Qualidade", value: 74 },
    { group: "Produto B", feature: "Suporte", value: 82 }
  ]
};

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

const chartState = {
  currentType: "line",
  colors: ["#0f62fe", "#24a148", "#8a3ffc", "#ff832b"],
  yMin: null,
  yMax: null,
  height: 420,
  dataOffsetA: 0,
  dataOffsetB: 0,
  pieA: 38,
  pieB: 26,
  pieC: 20,
  pieD: 16,
  scatterXOffset: 0,
  scatterYOffset: 0
};

function numeric(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function buildControls(type) {
  if (!controlsHost) return;

  const shared = [
    { id: "height", title: "Altura", label: "Altura do grafico (px)", value: String(chartState.height), helper: "Ex.: 420", type: "number" },
    { id: "yMin", title: "Eixo Y", label: "Y minimo", value: chartState.yMin == null ? "" : String(chartState.yMin), helper: "Vazio = automatico", type: "number" },
    { id: "yMax", title: "Eixo Y", label: "Y maximo", value: chartState.yMax == null ? "" : String(chartState.yMax), helper: "Vazio = automatico", type: "number" },
    { id: "colorA", title: "Cor serie A", label: "HEX serie 1", value: chartState.colors[0], helper: "Ex.: #0f62fe", type: "text" },
    { id: "colorB", title: "Cor serie B", label: "HEX serie 2", value: chartState.colors[1], helper: "Ex.: #24a148", type: "text" }
  ];

  const byType = {
    line: [
      { id: "dataOffsetA", title: "Valores", label: "Offset Produto A", value: String(chartState.dataOffsetA), helper: "Soma direta nos valores", type: "number" },
      { id: "dataOffsetB", title: "Valores", label: "Offset Produto B", value: String(chartState.dataOffsetB), helper: "Soma direta nos valores", type: "number" }
    ],
    area: [
      { id: "dataOffsetA", title: "Valores", label: "Offset Produto A", value: String(chartState.dataOffsetA), helper: "Soma direta nos valores", type: "number" },
      { id: "dataOffsetB", title: "Valores", label: "Offset Produto B", value: String(chartState.dataOffsetB), helper: "Soma direta nos valores", type: "number" }
    ],
    simple_bar: [
      { id: "dataOffsetA", title: "Valores", label: "Offset barras", value: String(chartState.dataOffsetA), helper: "Soma direta nas barras", type: "number" }
    ],
    grouped_bar: [
      { id: "dataOffsetA", title: "Valores", label: "Offset Produto A", value: String(chartState.dataOffsetA), helper: "Soma direta", type: "number" },
      { id: "dataOffsetB", title: "Valores", label: "Offset Produto B", value: String(chartState.dataOffsetB), helper: "Soma direta", type: "number" }
    ],
    stacked_bar: [
      { id: "dataOffsetA", title: "Valores", label: "Offset Produto A", value: String(chartState.dataOffsetA), helper: "Soma direta", type: "number" },
      { id: "dataOffsetB", title: "Valores", label: "Offset Produto B", value: String(chartState.dataOffsetB), helper: "Soma direta", type: "number" }
    ],
    pie: [
      { id: "pieA", title: "Fatias", label: "Produto A", value: String(chartState.pieA), helper: "Valor da fatia", type: "number" },
      { id: "pieB", title: "Fatias", label: "Produto B", value: String(chartState.pieB), helper: "Valor da fatia", type: "number" },
      { id: "pieC", title: "Fatias", label: "Produto C", value: String(chartState.pieC), helper: "Valor da fatia", type: "number" },
      { id: "pieD", title: "Fatias", label: "Produto D", value: String(chartState.pieD), helper: "Valor da fatia", type: "number" }
    ],
    donut: [
      { id: "pieA", title: "Fatias", label: "Produto A", value: String(chartState.pieA), helper: "Valor da fatia", type: "number" },
      { id: "pieB", title: "Fatias", label: "Produto B", value: String(chartState.pieB), helper: "Valor da fatia", type: "number" },
      { id: "pieC", title: "Fatias", label: "Produto C", value: String(chartState.pieC), helper: "Valor da fatia", type: "number" },
      { id: "pieD", title: "Fatias", label: "Produto D", value: String(chartState.pieD), helper: "Valor da fatia", type: "number" }
    ],
    scatter: [
      { id: "scatterXOffset", title: "Eixo X", label: "Offset X", value: String(chartState.scatterXOffset), helper: "Soma direta no eixo X", type: "number" },
      { id: "scatterYOffset", title: "Eixo Y", label: "Offset Y", value: String(chartState.scatterYOffset), helper: "Soma direta no eixo Y", type: "number" }
    ],
    bubble: [
      { id: "scatterXOffset", title: "Eixo X", label: "Offset X", value: String(chartState.scatterXOffset), helper: "Soma direta no eixo X", type: "number" },
      { id: "scatterYOffset", title: "Eixo Y", label: "Offset Y", value: String(chartState.scatterYOffset), helper: "Soma direta no eixo Y", type: "number" }
    ],
    radar: [
      { id: "dataOffsetA", title: "Valores", label: "Offset Produto A", value: String(chartState.dataOffsetA), helper: "Soma direta", type: "number" },
      { id: "dataOffsetB", title: "Valores", label: "Offset Produto B", value: String(chartState.dataOffsetB), helper: "Soma direta", type: "number" }
    ]
  };

  const defs = [...shared, ...(byType[type] || [])];

  controlsHost.innerHTML = defs
    .map(
      (field) =>
        `<cds-text-input id="ctrl-${field.id}" title-text="${field.title}" label="${field.label}" value="${field.value}" helper-text="${field.helper}" type="${field.type}"></cds-text-input>`
    )
    .join("");

  defs.forEach((field) => {
    const node = document.getElementById(`ctrl-${field.id}`);
    if (!node) return;
    ["input", "change"].forEach((ev) => {
      node.addEventListener(ev, () => {
        const val = node.value;
        if (["height", "yMin", "yMax", "dataOffsetA", "dataOffsetB", "pieA", "pieB", "pieC", "pieD", "scatterXOffset", "scatterYOffset"].includes(field.id)) {
          if ((field.id === "yMin" || field.id === "yMax") && val === "") {
            chartState[field.id] = null;
          } else {
            chartState[field.id] = numeric(val, chartState[field.id] || 0);
          }
        } else {
          chartState[field.id] = val;
        }
        if (field.id === "colorA") chartState.colors[0] = val;
        if (field.id === "colorB") chartState.colors[1] = val;
        renderChart(chartState.currentType);
      });
    });
  });
}

function buildData(type) {
  if (type === "pie" || type === "donut") {
    return [
      { group: "Produto A", value: numeric(chartState.pieA, 38) },
      { group: "Produto B", value: numeric(chartState.pieB, 26) },
      { group: "Produto C", value: numeric(chartState.pieC, 20) },
      { group: "Produto D", value: numeric(chartState.pieD, 16) }
    ];
  }

  return (baseDataCatalog[type] || []).map((row) => {
    const next = { ...row };

    if (type === "scatter" || type === "bubble") {
      if (typeof next.x === "number") next.x += numeric(chartState.scatterXOffset, 0);
      if (typeof next.y === "number") next.y += numeric(chartState.scatterYOffset, 0);
      return next;
    }

    const isA = next.group === "Produto A";
    const isB = next.group === "Produto B";
    const offset = isA ? numeric(chartState.dataOffsetA, 0) : isB ? numeric(chartState.dataOffsetB, 0) : numeric(chartState.dataOffsetA, 0);

    if (typeof next.value === "number") next.value += offset;
    if (typeof next.y === "number") next.y += offset;
    return next;
  });
}

function buildOptions(type) {
  const height = `${Math.max(280, numeric(chartState.height, 420))}px`;
  const color = {
    scale: {
      "Produto A": chartState.colors[0] || "#0f62fe",
      "Produto B": chartState.colors[1] || "#24a148"
    }
  };

  const axisLeft = { mapsTo: "value" };
  if (chartState.yMin != null) axisLeft.domainMin = numeric(chartState.yMin, 0);
  if (chartState.yMax != null) axisLeft.domainMax = numeric(chartState.yMax, 0);

  if (type === "line" || type === "area") {
    return {
      title: type === "line" ? "Line" : "Area",
      axes: {
        left: { ...axisLeft, title: "Valor" },
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
        left: type === "stacked_bar" ? { ...axisLeft, stacked: true } : axisLeft,
        bottom: { mapsTo: "key", scaleType: "labels" }
      },
      color,
      height
    };
  }

  if (type === "pie") {
    return { title: "Pie", pie: { alignment: "center" }, color, height };
  }

  if (type === "donut") {
    return { title: "Donut", donut: { center: { label: "Total" } }, color, height };
  }

  if (type === "scatter") {
    return {
      title: "Scatter",
      axes: {
        left: { mapsTo: "y" },
        bottom: { mapsTo: "x", scaleType: "linear" }
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
        bottom: { mapsTo: "x", scaleType: "linear" }
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

  const chartsNamespace = window.Charts || window.CarbonCharts;
  if (!chartsNamespace) {
    chartHolder.innerHTML = "<p>Erro: Carbon Charts nao carregou.</p>";
    return;
  }

  const ChartCtor = chartsNamespace[chartClassMap[type]];
  if (!ChartCtor) {
    chartHolder.innerHTML = "<p>Erro: tipo de grafico indisponivel.</p>";
    return;
  }

  chartState.currentType = type;
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
  sideNavToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
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
      buildControls(value);
      renderChart(value);
    }
  });
}

bindSideNav();
bindSideNavSubmenus();
buildControls("line");
renderChart("line");
