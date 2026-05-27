const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const actionButton = document.getElementById('action-btn');
const status = document.getElementById('status');

const THEME_KEY = 'testestudio-theme';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getActiveTheme() {
  return root.getAttribute('data-theme') || getSystemTheme();
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.setAttribute('data-theme', savedTheme);
  }
}

function updateThemeButtonText() {
  if (!themeToggle) {
    return;
  }

  const current = getActiveTheme();
  themeToggle.textContent = current === 'dark' ? 'Usar tema claro' : 'Usar tema escuro';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = getActiveTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    updateThemeButtonText();
  });
}

if (actionButton && status) {
  actionButton.addEventListener('click', () => {
    const now = new Date();
    status.textContent = `Botao primario acionado em ${now.toLocaleTimeString('pt-BR')}.`;
  });
}

applySavedTheme();
updateThemeButtonText();
