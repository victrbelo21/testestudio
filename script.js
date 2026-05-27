const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const actionButton = document.getElementById("action-btn");
const status = document.getElementById("status");
const textCounterInput = document.getElementById("text-counter");
const textCounterValue = document.getElementById("text-counter-value");
const indeterminateCheckbox = document.getElementById("checkbox-indeterminate");
const readonlyCheckboxes = document.querySelectorAll('[data-readonly="true"]');
const paletteFull = document.getElementById("palette-full");

const THEME_KEY = "testestudio-theme";

const IBM_PALETTE_FAMILIES = [
  {
    name: "Red",
    steps: {
      100: "#2d0709",
      90: "#520408",
      80: "#750e13",
      70: "#a2191f",
      60: "#da1e28",
      50: "#fa4d56",
      40: "#ff8389",
      30: "#ffb3b8",
      20: "#ffd7d9",
      10: "#fff1f1"
    }
  },
  {
    name: "Magenta",
    steps: {
      100: "#2a0a18",
      90: "#510224",
      80: "#740937",
      70: "#9f1853",
      60: "#d02670",
      50: "#ee5396",
      40: "#ff7eb6",
      30: "#ffafd2",
      20: "#ffd6e8",
      10: "#fff0f7"
    }
  },
  {
    name: "Purple",
    steps: {
      100: "#1c0f30",
      90: "#31135e",
      80: "#491d8b",
      70: "#6929c4",
      60: "#8a3ffc",
      50: "#a56eff",
      40: "#be95ff",
      30: "#d4bbff",
      20: "#e8daff",
      10: "#f6f2ff"
    }
  },
  {
    name: "Blue",
    steps: {
      100: "#001141",
      90: "#001d6c",
      80: "#002d9c",
      70: "#0043ce",
      60: "#0f62fe",
      50: "#4589ff",
      40: "#78a9ff",
      30: "#a6c8ff",
      20: "#d0e2ff",
      10: "#edf5ff"
    }
  },
  {
    name: "Cyan",
    steps: {
      100: "#061727",
      90: "#012749",
      80: "#003a6d",
      70: "#00539a",
      60: "#0072c3",
      50: "#1192e8",
      40: "#33b1ff",
      30: "#82cfff",
      20: "#bae6ff",
      10: "#e5f6ff"
    }
  },
  {
    name: "Teal",
    steps: {
      100: "#081a1c",
      90: "#022b30",
      80: "#004144",
      70: "#005d5d",
      60: "#007d79",
      50: "#009d9a",
      40: "#08bdba",
      30: "#3ddbd9",
      20: "#9ef0f0",
      10: "#d9fbfb"
    }
  },
  {
    name: "Green",
    steps: {
      100: "#071908",
      90: "#022d0d",
      80: "#044317",
      70: "#0e6027",
      60: "#198038",
      50: "#24a148",
      40: "#42be65",
      30: "#6fdc8c",
      20: "#a7f0ba",
      10: "#defbe6"
    }
  },
  {
    name: "Cool Gray",
    steps: {
      100: "#121619",
      90: "#21272a",
      80: "#343a3f",
      70: "#4d5358",
      60: "#697077",
      50: "#878d96",
      40: "#a2a9b0",
      30: "#c1c7cd",
      20: "#dde1e6",
      10: "#f2f4f8"
    }
  },
  {
    name: "Gray",
    steps: {
      100: "#161616",
      90: "#262626",
      80: "#393939",
      70: "#525252",
      60: "#6f6f6f",
      50: "#8d8d8d",
      40: "#a8a8a8",
      30: "#c6c6c6",
      20: "#e0e0e0",
      10: "#f4f4f4"
    }
  },
  {
    name: "Warm Gray",
    steps: {
      100: "#171414",
      90: "#272525",
      80: "#3c3838",
      70: "#565151",
      60: "#726e6e",
      50: "#8f8b8b",
      40: "#ada8a8",
      30: "#cac5c4",
      20: "#e5e0df",
      10: "#f7f3f2"
    }
  },
  {
    name: "Black and White",
    steps: {
      black: "#000000",
      white: "#ffffff"
    }
  },
  {
    name: "Alerts",
    steps: {
      "error-60": "#da1e28",
      "success-50": "#24a148",
      "warning-40": "#ff832b",
      "caution-30": "#f1c21b"
    }
  }
];

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getActiveTheme() {
  return root.getAttribute("data-theme") || getSystemTheme();
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }
}

function updateThemeButtonText() {
  if (!themeToggle) {
    return;
  }

  const currentTheme = getActiveTheme();
  themeToggle.textContent = currentTheme === "dark" ? "Usar tema claro" : "Usar tema escuro";
}

function updateTextCounter() {
  if (!textCounterInput || !textCounterValue) {
    return;
  }

  const limit = Number(textCounterInput.maxLength);
  const currentLength = textCounterInput.value.length;

  if (limit > 0) {
    textCounterValue.textContent = `${currentLength}/${limit}`;
    return;
  }

  textCounterValue.textContent = String(currentLength);
}

function setIndeterminateState() {
  if (!indeterminateCheckbox) {
    return;
  }

  indeterminateCheckbox.indeterminate = true;
}

function lockReadonlyCheckboxes() {
  readonlyCheckboxes.forEach((checkbox) => {
    const initialValue = checkbox.checked;

    checkbox.addEventListener("click", (event) => {
      event.preventDefault();
      checkbox.checked = initialValue;
    });

    checkbox.addEventListener("change", () => {
      checkbox.checked = initialValue;
    });

    checkbox.addEventListener("keydown", (event) => {
      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
      }
    });
  });
}

function isLightColor(hexColor) {
  const hex = hexColor.replace("#", "");

  if (hex.length !== 6) {
    return false;
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luma = 0.299 * red + 0.587 * green + 0.114 * blue;

  return luma >= 165;
}

function createPaletteSwatch(step, hexValue) {
  const swatch = document.createElement("div");
  swatch.className = "swatch";

  if (isLightColor(hexValue)) {
    swatch.classList.add("swatch--light");
  }

  swatch.style.setProperty("--swatch", hexValue);

  const stepLabel = document.createElement("span");
  stepLabel.className = "swatch__step";
  stepLabel.textContent = String(step);

  const hexLabel = document.createElement("small");
  hexLabel.className = "swatch__hex";
  hexLabel.textContent = hexValue.toUpperCase();

  swatch.append(stepLabel, hexLabel);
  return swatch;
}

function renderPalette() {
  if (!paletteFull) {
    return;
  }

  paletteFull.innerHTML = "";

  IBM_PALETTE_FAMILIES.forEach((family) => {
    const familyCard = document.createElement("article");
    familyCard.className = "palette-family";

    const title = document.createElement("h3");
    title.textContent = family.name;

    const ramp = document.createElement("div");
    ramp.className = "palette-ramp";

    Object.entries(family.steps).forEach(([step, hexValue]) => {
      ramp.appendChild(createPaletteSwatch(step, hexValue));
    });

    familyCard.append(title, ramp);
    paletteFull.appendChild(familyCard);
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = getActiveTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    updateThemeButtonText();
  });
}

if (actionButton && status) {
  actionButton.addEventListener("click", () => {
    const now = new Date();
    status.textContent = `Botao primario acionado em ${now.toLocaleTimeString("pt-BR")}.`;
  });
}

if (textCounterInput) {
  textCounterInput.addEventListener("input", updateTextCounter);
}

applySavedTheme();
updateThemeButtonText();
updateTextCounter();
setIndeterminateState();
lockReadonlyCheckboxes();
renderPalette();
