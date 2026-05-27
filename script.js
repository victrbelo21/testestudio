const chartHolder = document.getElementById("radar-chart");
const exportButton = document.getElementById("export-csv-btn");
const status = document.getElementById("status");

const radarData = [
  { product: "Produto A", feature: "Preco", score: 72 },
  { product: "Produto A", feature: "Usabilidade", score: 88 },
  { product: "Produto A", feature: "Performance", score: 79 },
  { product: "Produto A", feature: "Qualidade", score: 91 },
  { product: "Produto A", feature: "Suporte", score: 67 },
  { product: "Produto B", feature: "Preco", score: 63 },
  { product: "Produto B", feature: "Usabilidade", score: 77 },
  { product: "Produto B", feature: "Performance", score: 85 },
  { product: "Produto B", feature: "Qualidade", score: 74 },
  { product: "Produto B", feature: "Suporte", score: 82 }
];

const radarOptions = {
  title: "Comparativo de 2 produtos",
  radar: {
    axes: {
      angle: "feature",
      value: "score"
    }
  },
  data: {
    groupMapsTo: "product"
  },
  height: "400px"
};

function renderRadar() {
  if (!chartHolder || !status) {
    return;
  }

  const RadarChartCtor = window.Charts?.RadarChart || window.CarbonCharts?.RadarChart;

  if (!RadarChartCtor) {
    status.textContent = "Erro: biblioteca do Carbon Charts não carregou.";
    return;
  }

  // eslint-disable-next-line no-new
  new RadarChartCtor(chartHolder, {
    data: radarData,
    options: radarOptions
  });

  status.textContent = "Gráfico carregado com sucesso.";
}

function exportCsv(rows, fileName) {
  const headers = ["product", "feature", "score"];
  const body = rows.map((row) => [row.product, row.feature, row.score].join(","));
  const csv = [headers.join(","), ...body].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

if (exportButton && status) {
  exportButton.addEventListener("click", () => {
    exportCsv(radarData, "radar-produtos.csv");
    status.textContent = "CSV exportado com sucesso.";
  });
}

renderRadar();
