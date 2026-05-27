const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const actionButton = document.getElementById("action-btn");
const status = document.getElementById("status");
const textCounterInput = document.getElementById("text-counter");
const textCounterValue = document.getElementById("text-counter-value");
const indeterminateCheckbox = document.getElementById("checkbox-indeterminate");
const readonlyCheckboxes = document.querySelectorAll('[data-readonly="true"]');

const THEME_KEY = "testestudio-theme";

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
