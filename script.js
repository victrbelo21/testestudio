const chartHolder = document.getElementById("chart-container");
const chartSelector = document.getElementById("chart-selector");
const scaleAInput = document.getElementById("scale-a");
const scaleBInput = document.getElementById("scale-b");

const sideNav = document.getElementById("side-nav");
const sideNavOverlay = document.getElementById("side-nav-overlay");
const sideNavToggle = document.getElementById("header-menu-toggle");
const sideNavSubmenus = document.querySelectorAll(".cds--side-nav__submenu");

const desktopMedia = window.matchMedia("(min-width: 1056px)");

const dataCatalog = {
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

const optionsCatalog = {
  line: { title: "Line", axes: { left: { mapsTo: "value", title: "Valor" }, bottom: { mapsTo: "date", scaleType: "time" } }, curve: "curveMonotoneX", height: "420px" },
  area: { title: "Area", axes: { left: { mapsTo: "value", title: "Valor" }, bottom: { mapsTo: "date", scaleType: "time" } }, curve: "curveMonotoneX", height: "420px" },
  simple_bar: { title: "Simple bar", axes: { left: { mapsTo: "value" }, bottom: { mapsTo: "key", scaleType: "labels" } }, height: "420px" },
  grouped_bar: { title: "Grouped bar", axes: { left: { mapsTo: "value" }, bottom: { mapsTo: "key", scaleType: "labels" } }, height: "420px" },
  stacked_bar: { title: "Stacked bar", axes: { left: { mapsTo: "value", stacked: true }, bottom: { mapsTo: "key", scaleType: "labels" } }, height: "420px" },
  pie: { title: "Pie", pie: { alignment: "center" }, height: "420px" },
  donut: { title: "Donut", donut: { center: { label: "Total" } }, height: "420px" },
  scatter: { title: "Scatter", axes: { left: { mapsTo: "y" }, bottom: { mapsTo: "x", scaleType: "linear" } }, height: "420px" },
  bubble: { title: "Bubble", axes: { left: { mapsTo: "y" }, bottom: { mapsTo: "x", scaleType: "linear" } }, bubble: { radiusMapsTo: "value" }, height: "420px" },
  radar: { title: "Radar", radar: { axes: { angle: "feature", value: "value" } }, height: "420px" }
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

let currentType = "line";

function readFactor(input) {
  const parsed = Number(input?.value ?? 1);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function scaledData(type) {
  const base = dataCatalog[type] || [];
  const scaleA = readFactor(scaleAInput);
  const scaleB = readFactor(scaleBInput);

  return base.map((row) => {
    const isA = row.group === "Produto A";
    const isB = row.group === "Produto B";
    const factor = isA ? scaleA : isB ? scaleB : 1;

    const next = { ...row };
    if (typeof next.value === "number") {
      next.value = Math.round(next.value * factor);
    }
    if (typeof next.y === "number") {
      next.y = Math.round(next.y * factor);
    }
    return next;
  });
}

function renderChart(type) {
  if (!chartHolder) {
    return;
  }

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

  currentType = type;
  chartHolder.innerHTML = "";
  new ChartCtor(chartHolder, {
    data: scaledData(type),
    options: optionsCatalog[type]
  });
}

function setSideNavOpen(isOpen) {
  if (!sideNav || !sideNavOverlay || !sideNavToggle) {
    return;
  }

  sideNav.classList.toggle("is-open", isOpen);
  sideNav.setAttribute("aria-hidden", String(!isOpen));
  sideNavToggle.setAttribute("aria-expanded", String(isOpen));
  sideNavToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  sideNavOverlay.hidden = desktopMedia.matches || !isOpen;
}

function bindSideNav() {
  if (!sideNav || !sideNavOverlay || !sideNavToggle) {
    return;
  }

  sideNavToggle.addEventListener("click", () => {
    setSideNavOpen(!sideNav.classList.contains("is-open"));
  });

  sideNavOverlay.addEventListener("click", () => {
    setSideNavOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setSideNavOpen(false);
    }
  });

  desktopMedia.addEventListener("change", () => {
    if (desktopMedia.matches && !sideNav.classList.contains("is-open")) {
      setSideNavOpen(true);
    }
    if (!desktopMedia.matches) {
      setSideNavOpen(false);
    }
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
      renderChart(value);
    }
  });
}

[scaleAInput, scaleBInput].forEach((input) => {
  if (!input) return;
  input.addEventListener("input", () => renderChart(currentType));
  input.addEventListener("change", () => renderChart(currentType));
});

bindSideNav();
bindSideNavSubmenus();
renderChart("line");
