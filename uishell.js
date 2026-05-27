const shellMenuButton = document.getElementById("header-menu-button");
const leftPanel = document.getElementById("left-panel");
const leftPanelOverlay = document.getElementById("left-panel-overlay");
const globalSwitcherButton = document.getElementById("global-switcher");
const switcherPanel = document.getElementById("switcher-panel");
const globalSearchButton = document.getElementById("global-search");
const globalNotificationsButton = document.getElementById("global-notifications");
const shellStatus = document.getElementById("uishell-status");

const sideNavSubmenuButtons = document.querySelectorAll(".cds--side-nav__submenu");
const sideNavLinks = document.querySelectorAll(".cds--side-nav__link");
const headerMenus = document.querySelectorAll("[data-header-menu]");
const headerMenuButtons = document.querySelectorAll(".cds--header__menu-title");

const desktopMedia = window.matchMedia("(min-width: 1056px)");

function updateShellStatus(message) {
  if (!shellStatus) {
    return;
  }

  shellStatus.textContent = `Estado: ${message}`;
}

function isDesktopShell() {
  return desktopMedia.matches;
}

function setMenuButtonState(isExpanded) {
  if (!shellMenuButton) {
    return;
  }

  shellMenuButton.setAttribute("aria-expanded", String(isExpanded));
  shellMenuButton.setAttribute("aria-label", isExpanded ? "Close menu" : "Open menu");

  const icon = shellMenuButton.querySelector(".cds--header__menu-icon");

  if (icon) {
    icon.textContent = isExpanded ? "✕" : "☰";
  }
}

function closeLeftPanel() {
  if (!leftPanel || !leftPanelOverlay) {
    return;
  }

  leftPanel.classList.remove("is-expanded");
  leftPanelOverlay.classList.remove("active");
  document.body.classList.remove("uishell-lock-scroll");
  setMenuButtonState(false);
}

function openLeftPanel() {
  if (!leftPanel || !leftPanelOverlay) {
    return;
  }

  leftPanel.classList.add("is-expanded");
  leftPanelOverlay.classList.add("active");
  document.body.classList.add("uishell-lock-scroll");
  setMenuButtonState(true);
}

function toggleLeftPanel() {
  if (!leftPanel) {
    return;
  }

  const isExpanded = leftPanel.classList.contains("is-expanded");

  if (isExpanded) {
    closeLeftPanel();
    updateShellStatus("left panel recolhido.");
    return;
  }

  openLeftPanel();
  updateShellStatus("left panel expandido.");
}

function setSwitcherExpanded(isExpanded) {
  if (!switcherPanel || !globalSwitcherButton) {
    return;
  }

  switcherPanel.classList.toggle("is-expanded", isExpanded);
  switcherPanel.setAttribute("aria-hidden", String(!isExpanded));
  globalSwitcherButton.classList.toggle("is-active", isExpanded);
  globalSwitcherButton.setAttribute("aria-expanded", String(isExpanded));
}

function closeHeaderMenus(exceptMenu = null) {
  headerMenus.forEach((menu) => {
    if (menu !== exceptMenu) {
      menu.classList.remove("is-open");
      const button = menu.querySelector(".cds--header__menu-title");

      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    }
  });
}

function highlightCurrentSideNavLink(targetLink) {
  sideNavLinks.forEach((link) => {
    link.classList.remove("cds--side-nav__link--current");
    const parentItem = link.closest(".cds--side-nav__item");

    if (parentItem) {
      parentItem.classList.remove("is-current");
    }
  });

  if (!targetLink) {
    return;
  }

  targetLink.classList.add("cds--side-nav__link--current");
  const parentItem = targetLink.closest(".cds--side-nav__item");

  if (parentItem) {
    parentItem.classList.add("is-current");
  }
}

function syncCurrentFromHash() {
  const { hash } = window.location;

  if (!hash) {
    return;
  }

  const matchingLink = Array.from(sideNavLinks).find((link) => link.getAttribute("href") === hash);

  if (matchingLink) {
    highlightCurrentSideNavLink(matchingLink);
  }
}

shellMenuButton?.addEventListener("click", () => {
  if (isDesktopShell()) {
    return;
  }

  toggleLeftPanel();
});

leftPanelOverlay?.addEventListener("click", () => {
  closeLeftPanel();
  updateShellStatus("left panel recolhido pelo overlay.");
});

globalSwitcherButton?.addEventListener("click", () => {
  if (!switcherPanel) {
    return;
  }

  const isExpanded = switcherPanel.classList.contains("is-expanded");
  setSwitcherExpanded(!isExpanded);
  updateShellStatus(!isExpanded ? "right panel (switcher) expandido." : "right panel (switcher) recolhido.");
});

globalSearchButton?.addEventListener("click", () => {
  updateShellStatus("acao global de busca acionada.");
});

globalNotificationsButton?.addEventListener("click", () => {
  updateShellStatus("acao global de notificacoes acionada.");
});

headerMenuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const menu = button.closest("[data-header-menu]");

    if (!menu) {
      return;
    }

    const willOpen = !menu.classList.contains("is-open");
    closeHeaderMenus(menu);
    menu.classList.toggle("is-open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
  });
});

sideNavSubmenuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".cds--side-nav__item");

    if (!item) {
      return;
    }

    const willOpen = !item.classList.contains("is-open");
    item.classList.toggle("is-open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
  });
});

sideNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    highlightCurrentSideNavLink(link);

    if (!isDesktopShell()) {
      closeLeftPanel();
    }
  });
});

window.addEventListener("hashchange", () => {
  syncCurrentFromHash();
});

window.addEventListener("resize", () => {
  if (isDesktopShell()) {
    closeLeftPanel();
    setSwitcherExpanded(false);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof Node)) {
    return;
  }

  const clickedInsideHeaderMenu = Array.from(headerMenus).some((menu) => menu.contains(target));

  if (!clickedInsideHeaderMenu) {
    closeHeaderMenus();
  }

  if (switcherPanel && globalSwitcherButton) {
    const clickedInsideSwitcher = switcherPanel.contains(target) || globalSwitcherButton.contains(target);

    if (!clickedInsideSwitcher) {
      setSwitcherExpanded(false);
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  closeHeaderMenus();
  closeLeftPanel();
  setSwitcherExpanded(false);
  updateShellStatus("shell recolhida com tecla Escape.");
});

function injectEnhancementStyles() {
  if (document.getElementById("shell-enhancements-style")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "shell-enhancements-style";
  style.textContent = `
    :root {
      --shell-header-bg: var(--ibm-cool-gray-100);
      --shell-header-text: var(--ibm-cool-gray-10);
      --shell-header-hover: var(--ibm-cool-gray-90);
      --shell-header-border: var(--ibm-cool-gray-80);
      --shell-panel-bg: var(--ibm-cool-gray-90);
      --shell-panel-text: var(--ibm-cool-gray-10);
      --shell-side-bg: var(--ibm-cool-gray-90);
      --shell-side-text: var(--ibm-cool-gray-30);
      --shell-side-hover: var(--ibm-cool-gray-80);
      --shell-side-selected-bg: var(--ibm-blue-70);
      --shell-side-selected-text: var(--ibm-white);
      --shell-side-selected-border: var(--ibm-blue-60);
    }

    :root[data-theme="light"] {
      --shell-header-bg: var(--layer-01);
      --shell-header-text: var(--text-primary);
      --shell-header-hover: var(--layer-hover);
      --shell-header-border: var(--border-subtle);
      --shell-panel-bg: var(--layer-01);
      --shell-panel-text: var(--text-secondary);
      --shell-side-bg: var(--layer-01);
      --shell-side-text: var(--text-secondary);
      --shell-side-hover: var(--layer-hover);
      --shell-side-selected-bg: var(--layer-02);
      --shell-side-selected-text: var(--text-primary);
      --shell-side-selected-border: var(--border-interactive);
    }

    @media (prefers-color-scheme: light) {
      :root:not([data-theme]) {
        --shell-header-bg: var(--layer-01);
        --shell-header-text: var(--text-primary);
        --shell-header-hover: var(--layer-hover);
        --shell-header-border: var(--border-subtle);
        --shell-panel-bg: var(--layer-01);
        --shell-panel-text: var(--text-secondary);
        --shell-side-bg: var(--layer-01);
        --shell-side-text: var(--text-secondary);
        --shell-side-hover: var(--layer-hover);
        --shell-side-selected-bg: var(--layer-02);
        --shell-side-selected-text: var(--text-primary);
        --shell-side-selected-border: var(--border-interactive);
      }
    }

    :root[data-theme="dark"] {
      --shell-header-bg: var(--ibm-cool-gray-90);
      --shell-header-text: var(--ibm-cool-gray-10);
      --shell-header-hover: #2d3338;
      --shell-header-border: var(--ibm-cool-gray-70);
      --shell-panel-bg: var(--ibm-cool-gray-90);
      --shell-panel-text: var(--ibm-cool-gray-20);
      --shell-side-bg: var(--ibm-cool-gray-90);
      --shell-side-text: var(--ibm-cool-gray-30);
      --shell-side-hover: #2d3338;
      --shell-side-selected-bg: var(--ibm-blue-70);
      --shell-side-selected-text: var(--ibm-cool-gray-10);
      --shell-side-selected-border: var(--ibm-blue-40);
    }

    html,
    body {
      background: var(--bg-subtle);
    }

    .app-shell.app-shell--uishell {
      inline-size: 100%;
      max-inline-size: 100%;
      margin-inline: 0;
      padding-inline: 0;
      min-block-size: calc(100vh - var(--header-height));
      background: var(--bg-subtle);
    }

    .app-shell.app-shell--uishell .app-main {
      inline-size: 100%;
      max-inline-size: 100%;
      background: var(--bg-subtle);
    }

    .app-header.cds--header {
      background: var(--shell-header-bg);
      color: var(--shell-header-text);
      border-block-end-color: var(--shell-header-border);
    }

    .cds--header__name,
    .cds--header__menu-item,
    .cds--header__menu-title,
    .cds--header__action,
    .cds--header__menu-toggle {
      color: var(--shell-header-text);
    }

    .cds--header__name:hover,
    .cds--header__menu-item:hover,
    .cds--header__menu-title:hover,
    .cds--header__action:hover {
      background: var(--shell-header-hover);
    }

    .cds--header__name--prefix {
      color: var(--shell-side-text);
    }

    .cds--header__action {
      border-inline-start-color: var(--shell-header-border);
    }

    .side-nav.cds--side-nav {
      background: var(--shell-side-bg);
      color: var(--shell-side-text);
      border-inline-end-color: var(--border-subtle);
    }

    .cds--side-nav__submenu,
    .cds--side-nav__link {
      color: var(--shell-side-text);
    }

    .cds--side-nav__submenu:hover,
    .cds--side-nav__link:hover {
      background: var(--shell-side-hover);
      color: var(--shell-header-text);
    }

    .cds--side-nav__link--current,
    .cds--side-nav__item.is-current > .cds--side-nav__link {
      background: var(--shell-side-selected-bg);
      color: var(--shell-side-selected-text);
      box-shadow: inset 4px 0 0 var(--shell-side-selected-border);
    }

    .component-visualization-selector {
      display: grid;
      gap: var(--size-1);
      max-inline-size: 320px;
      margin-block-start: var(--size-2);
    }

    .component-view-card[hidden] {
      display: none !important;
    }

    .cds--accordion {
      margin: 0;
      padding: 0;
      list-style: none;
      border-block-end: 1px solid var(--border-subtle);
    }

    .cds--accordion__item {
      border-block-start: 1px solid var(--border-subtle);
      background: transparent;
    }

    .cds--accordion__heading {
      inline-size: 100%;
      min-block-size: var(--layout-size-md);
      display: flex;
      align-items: center;
      gap: var(--size-2);
      padding: 0 var(--size-2);
      border: 0;
      background: transparent;
      color: var(--text-primary);
      font-size: 0.875rem;
      text-align: left;
      cursor: pointer;
    }

    .cds--accordion__heading:hover {
      background: var(--layer-hover);
    }

    .cds--accordion__heading:focus-visible {
      outline: 2px solid var(--focus);
      outline-offset: -2px;
    }

    .cds--accordion__arrow {
      inline-size: 16px;
      transition: transform 120ms ease;
    }

    .cds--accordion__item--active .cds--accordion__arrow {
      transform: rotate(90deg);
    }

    .cds--accordion__title {
      color: var(--text-primary);
      font-size: 0.875rem;
      line-height: 1.25rem;
    }

    .cds--accordion__panel {
      padding: var(--size-1) var(--size-2) var(--size-3) calc(var(--size-2) + 24px);
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .cds--tabs {
      border-block-end: 1px solid var(--border-subtle);
    }

    .cds--tabs__list {
      display: flex;
      align-items: stretch;
      margin: 0;
      padding: 0;
      list-style: none;
      gap: 1px;
    }

    .cds--tabs__nav-item {
      min-block-size: var(--layout-size-md);
      padding: var(--size-1) var(--size-2);
      border: 0;
      border-block-end: 2px solid var(--border-subtle);
      background: transparent;
      color: var(--text-secondary);
      font-size: 0.875rem;
      cursor: pointer;
    }

    .cds--tabs__nav-item:hover {
      color: var(--text-primary);
      border-block-end-color: var(--border-strong);
    }

    .cds--tabs__nav-item:focus-visible {
      outline: 2px solid var(--focus);
      outline-offset: -2px;
    }

    .cds--tabs__nav-item--selected {
      color: var(--text-primary);
      border-block-end-color: var(--border-interactive);
      font-weight: 600;
    }

    .cds--tabs__panel {
      padding: var(--size-2) 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .cds--tag-set {
      display: flex;
      flex-wrap: wrap;
      gap: var(--size-1);
    }

    .cds--tag {
      display: inline-flex;
      align-items: center;
      min-block-size: 24px;
      padding-inline: var(--size-1);
      border-radius: 999px;
      border: 1px solid transparent;
      font-size: 0.75rem;
      line-height: 1;
      white-space: nowrap;
      color: var(--text-primary);
      background: var(--layer-02);
    }

    .cds--tag__label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .cds--tag--dismissible .cds--tag__dismiss {
      margin-inline-start: 6px;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-size: 0.75rem;
      line-height: 1;
      padding: 0;
    }

    .cds--tag--dismissible .cds--tag__dismiss:focus-visible {
      outline: 2px solid var(--focus);
      outline-offset: 2px;
    }

    .cds--tag--selectable {
      cursor: pointer;
    }

    .cds--tag--selectable[aria-pressed="true"] {
      box-shadow: inset 0 0 0 1px var(--border-interactive);
    }

    .cds--tag--red { background: var(--ibm-red-20); color: var(--ibm-red-70); border-color: var(--ibm-red-40); }
    .cds--tag--magenta { background: var(--ibm-magenta-20); color: var(--ibm-magenta-70); border-color: var(--ibm-magenta-40); }
    .cds--tag--purple { background: var(--ibm-purple-20); color: var(--ibm-purple-70); border-color: var(--ibm-purple-40); }
    .cds--tag--blue { background: var(--ibm-blue-20); color: var(--ibm-blue-70); border-color: var(--ibm-blue-40); }
    .cds--tag--cyan { background: var(--ibm-cyan-20); color: var(--ibm-cyan-70); border-color: var(--ibm-cyan-40); }
    .cds--tag--teal { background: var(--ibm-teal-20); color: var(--ibm-teal-70); border-color: var(--ibm-teal-40); }
    .cds--tag--green { background: var(--ibm-green-20); color: var(--ibm-green-70); border-color: var(--ibm-green-40); }
    .cds--tag--gray { background: var(--ibm-gray-20); color: var(--ibm-gray-70); border-color: var(--ibm-gray-40); }
    .cds--tag--cool-gray { background: var(--ibm-cool-gray-20); color: var(--ibm-cool-gray-70); border-color: var(--ibm-cool-gray-40); }
    .cds--tag--warm-gray { background: var(--ibm-warm-gray-20); color: var(--ibm-warm-gray-70); border-color: var(--ibm-warm-gray-40); }
    .cds--tag--high-contrast { background: var(--layer-01); color: var(--text-primary); border-color: var(--border-strong); }
    .cds--tag--outline { background: transparent; color: var(--text-secondary); border-color: var(--border-subtle); }

    :root[data-theme="dark"] .cds--tag--red { background: var(--ibm-red-70); color: var(--ibm-red-20); border-color: var(--ibm-red-50); }
    :root[data-theme="dark"] .cds--tag--magenta { background: var(--ibm-magenta-70); color: var(--ibm-magenta-20); border-color: var(--ibm-magenta-50); }
    :root[data-theme="dark"] .cds--tag--purple { background: var(--ibm-purple-70); color: var(--ibm-purple-20); border-color: var(--ibm-purple-50); }
    :root[data-theme="dark"] .cds--tag--blue { background: var(--ibm-blue-70); color: var(--ibm-blue-20); border-color: var(--ibm-blue-50); }
    :root[data-theme="dark"] .cds--tag--cyan { background: var(--ibm-cyan-70); color: var(--ibm-cyan-20); border-color: var(--ibm-cyan-50); }
    :root[data-theme="dark"] .cds--tag--teal { background: var(--ibm-teal-70); color: var(--ibm-teal-20); border-color: var(--ibm-teal-50); }
    :root[data-theme="dark"] .cds--tag--green { background: var(--ibm-green-70); color: var(--ibm-green-20); border-color: var(--ibm-green-50); }
    :root[data-theme="dark"] .cds--tag--gray { background: var(--ibm-gray-70); color: var(--ibm-gray-20); border-color: var(--ibm-gray-50); }
    :root[data-theme="dark"] .cds--tag--cool-gray { background: var(--ibm-cool-gray-70); color: var(--ibm-cool-gray-20); border-color: var(--ibm-cool-gray-50); }
    :root[data-theme="dark"] .cds--tag--warm-gray { background: var(--ibm-warm-gray-70); color: var(--ibm-warm-gray-20); border-color: var(--ibm-warm-gray-50); }

    @media (max-width: 1055px) {
      .app-shell.app-shell--uishell .app-main {
        padding-inline: var(--grid-padding);
      }
    }

    @media (max-width: 671px) {
      .cds--tabs__list {
        flex-direction: column;
      }

      .cds--tabs__nav-item {
        text-align: left;
      }
    }
  `;

  document.head.appendChild(style);
}

function addCarbonNavLinks() {
  const headerSubmenu = document.getElementById("header-submenu-components");

  if (headerSubmenu && !headerSubmenu.querySelector('a[href="#component-accordion"]')) {
    headerSubmenu.insertAdjacentHTML(
      "beforeend",
      `
        <li><a class="cds--header__submenu-item" href="#component-accordion" role="menuitem">Accordion</a></li>
        <li><a class="cds--header__submenu-item" href="#component-tabs" role="menuitem">Tabs</a></li>
        <li><a class="cds--header__submenu-item" href="#component-tag" role="menuitem">Tag</a></li>
      `
    );
  }

  const sideNavRoot = document.querySelector(".cds--side-nav__items");

  if (sideNavRoot && !document.querySelector('[aria-controls="side-nav-group-3"]')) {
    sideNavRoot.insertAdjacentHTML(
      "beforeend",
      `
        <li class="cds--side-nav__item is-open">
          <button
            class="cds--side-nav__submenu"
            type="button"
            aria-expanded="true"
            aria-controls="side-nav-group-3">
            <span class="cds--side-nav__submenu-title">Grupo 3</span>
            <span class="cds--side-nav__submenu-chevron" aria-hidden="true">▾</span>
          </button>
          <ul id="side-nav-group-3" class="cds--side-nav__menu">
            <li class="cds--side-nav__menu-item">
              <a class="cds--side-nav__link" href="#component-accordion">
                <span class="cds--side-nav__link-text">Accordion</span>
              </a>
            </li>
            <li class="cds--side-nav__menu-item">
              <a class="cds--side-nav__link" href="#component-tabs">
                <span class="cds--side-nav__link-text">Tabs</span>
              </a>
            </li>
            <li class="cds--side-nav__menu-item">
              <a class="cds--side-nav__link" href="#component-tag">
                <span class="cds--side-nav__link-text">Tag</span>
              </a>
            </li>
          </ul>
        </li>
      `
    );

    const newSubmenuButton = document.querySelector('[aria-controls="side-nav-group-3"]');

    if (newSubmenuButton) {
      newSubmenuButton.addEventListener("click", () => {
        const item = newSubmenuButton.closest(".cds--side-nav__item");

        if (!item) {
          return;
        }

        const willOpen = !item.classList.contains("is-open");
        item.classList.toggle("is-open", willOpen);
        newSubmenuButton.setAttribute("aria-expanded", String(willOpen));
      });
    }
  }
}

function injectNewComponents() {
  const main = document.getElementById("main-content");

  if (!main || document.getElementById("component-accordion")) {
    return;
  }

  const paletteSection = document.getElementById("palette");

  const template = document.createElement("template");
  template.innerHTML = `
    <section class="card card--full" id="group-3">
      <h1>Grupo 3/3: Accordion, Tabs e Tag</h1>
      <p>
        Componentes adicionais baseados no diretorio de componentes do Carbon React.
        Esta area possui 3 opcoes de visualizacao e um dropdown para mostrar somente a opcao desejada.
      </p>
      <div class="component-visualization-selector">
        <label class="text-input-label" for="component-view-select">Escolha a visualizacao</label>
        <div class="select-field-wrapper">
          <select id="component-view-select" class="select-input select-input--md" aria-describedby="component-view-helper">
            <option value="accordion" selected>Accordion</option>
            <option value="tabs">Tabs</option>
            <option value="tag">Tag</option>
          </select>
          <span class="select-arrow" aria-hidden="true">&#9662;</span>
        </div>
        <p id="component-view-helper" class="text-input-helper">Ao selecionar uma opcao, as outras visualizacoes sao ocultadas automaticamente.</p>
      </div>
    </section>

    <section class="card card--half component-view-card" id="component-accordion" data-view-option="accordion">
      <h2>Accordion</h2>
      <p class="text-input-helper">Estrutura inspirada nas classes `Accordion` e `AccordionItem` do Carbon React.</p>

      <ul class="cds--accordion" id="accordion-demo">
        <li class="cds--accordion__item cds--accordion__item--active">
          <button
            class="cds--accordion__heading"
            type="button"
            aria-expanded="true"
            aria-controls="accordion-panel-1"
            id="accordion-header-1">
            <span class="cds--accordion__arrow" aria-hidden="true">▸</span>
            <span class="cds--accordion__title">What is TesteStudio?</span>
          </button>
          <div class="cds--accordion__panel" id="accordion-panel-1" role="region" aria-labelledby="accordion-header-1">
            TesteStudio e uma pagina de referencia para componentes IBM Carbon com base no grid 2x e tokens oficiais.
          </div>
        </li>

        <li class="cds--accordion__item">
          <button
            class="cds--accordion__heading"
            type="button"
            aria-expanded="false"
            aria-controls="accordion-panel-2"
            id="accordion-header-2">
            <span class="cds--accordion__arrow" aria-hidden="true">▸</span>
            <span class="cds--accordion__title">How does keyboard interaction work?</span>
          </button>
          <div class="cds--accordion__panel" id="accordion-panel-2" role="region" aria-labelledby="accordion-header-2" hidden>
            Use Enter ou Space para expandir/recolher, e Escape para recolher o item ativo.
          </div>
        </li>

        <li class="cds--accordion__item">
          <button
            class="cds--accordion__heading"
            type="button"
            aria-expanded="false"
            aria-controls="accordion-panel-3"
            id="accordion-header-3">
            <span class="cds--accordion__arrow" aria-hidden="true">▸</span>
            <span class="cds--accordion__title">Can multiple items stay open?</span>
          </button>
          <div class="cds--accordion__panel" id="accordion-panel-3" role="region" aria-labelledby="accordion-header-3" hidden>
            Sim. Nesta implementacao, cada item e independente e pode ficar aberto em paralelo.
          </div>
        </li>
      </ul>
    </section>

    <section class="card card--half component-view-card" id="component-tabs" data-view-option="tabs" hidden>
      <h2>Tabs</h2>
      <p class="text-input-helper">Comportamento baseado em `Tabs`, `TabList`, `Tab` e `TabPanel` do Carbon React.</p>

      <div class="cds--tabs" data-tabs-demo>
        <div class="cds--tabs__list" role="tablist" aria-label="Tabs demo">
          <button class="cds--tabs__nav-item cds--tabs__nav-item--selected" role="tab" aria-selected="true" aria-controls="tabs-panel-1" id="tabs-tab-1" tabindex="0">Overview</button>
          <button class="cds--tabs__nav-item" role="tab" aria-selected="false" aria-controls="tabs-panel-2" id="tabs-tab-2" tabindex="-1">Guidelines</button>
          <button class="cds--tabs__nav-item" role="tab" aria-selected="false" aria-controls="tabs-panel-3" id="tabs-tab-3" tabindex="-1">Resources</button>
        </div>

        <div class="cds--tabs__panel" role="tabpanel" id="tabs-panel-1" aria-labelledby="tabs-tab-1">
          Overview da interface: shell, componentes de formulario e paleta oficial IBM.
        </div>
        <div class="cds--tabs__panel" role="tabpanel" id="tabs-panel-2" aria-labelledby="tabs-tab-2" hidden>
          Guidelines: 2x Grid (mini unit de 8px), tokens semanticos e estados interativos.
        </div>
        <div class="cds--tabs__panel" role="tabpanel" id="tabs-panel-3" aria-labelledby="tabs-tab-3" hidden>
          Resources: Carbon components, style docs e exemplos de acessibilidade para tablist e tabpanel.
        </div>
      </div>
    </section>

    <section class="card card--half component-view-card" id="component-tag" data-view-option="tag" hidden>
      <h2>Tag</h2>
      <p class="text-input-helper">Variacoes de `Tag` com familias de cor Carbon e exemplos dismissive/selectable.</p>

      <div class="component-stack">
        <div class="component-block">
          <h3>Read-only tags</h3>
          <div class="cds--tag-set">
            <span class="cds--tag cds--tag--red"><span class="cds--tag__label">Red</span></span>
            <span class="cds--tag cds--tag--magenta"><span class="cds--tag__label">Magenta</span></span>
            <span class="cds--tag cds--tag--purple"><span class="cds--tag__label">Purple</span></span>
            <span class="cds--tag cds--tag--blue"><span class="cds--tag__label">Blue</span></span>
            <span class="cds--tag cds--tag--cyan"><span class="cds--tag__label">Cyan</span></span>
            <span class="cds--tag cds--tag--teal"><span class="cds--tag__label">Teal</span></span>
            <span class="cds--tag cds--tag--green"><span class="cds--tag__label">Green</span></span>
            <span class="cds--tag cds--tag--gray"><span class="cds--tag__label">Gray</span></span>
            <span class="cds--tag cds--tag--cool-gray"><span class="cds--tag__label">Cool gray</span></span>
            <span class="cds--tag cds--tag--warm-gray"><span class="cds--tag__label">Warm gray</span></span>
            <span class="cds--tag cds--tag--high-contrast"><span class="cds--tag__label">High contrast</span></span>
            <span class="cds--tag cds--tag--outline"><span class="cds--tag__label">Outline</span></span>
          </div>
        </div>

        <div class="component-block">
          <h3>Dismissible and selectable</h3>
          <div class="cds--tag-set" id="tag-demo-actions">
            <span class="cds--tag cds--tag--blue cds--tag--dismissible">
              <span class="cds--tag__label">Closable</span>
              <button class="cds--tag__dismiss" type="button" aria-label="Remove tag">✕</button>
            </span>
            <button class="cds--tag cds--tag--outline cds--tag--selectable" type="button" aria-pressed="false">Selectable</button>
            <button class="cds--tag cds--tag--cool-gray cds--tag--selectable" type="button" aria-pressed="true">Selected</button>
          </div>
        </div>
      </div>
    </section>
  `;

  if (paletteSection) {
    main.insertBefore(template.content, paletteSection);
  } else {
    main.appendChild(template.content);
  }
}

function setupVisualizationSelector() {
  const select = document.getElementById("component-view-select");
  const cards = document.querySelectorAll(".component-view-card[data-view-option]");

  if (!select || cards.length < 3) {
    return;
  }

  const applySelection = (value) => {
    cards.forEach((card) => {
      const shouldShow = card.getAttribute("data-view-option") === value;
      card.hidden = !shouldShow;
      card.setAttribute("aria-hidden", String(!shouldShow));
    });

    updateShellStatus(`visualizacao ativa: ${value}.`);
  };

  applySelection(select.value);

  select.addEventListener("change", () => {
    applySelection(select.value);
  });
}

function setupAccordionDemo() {
  const headings = document.querySelectorAll("#accordion-demo .cds--accordion__heading");

  headings.forEach((button) => {
    const toggleItem = () => {
      const item = button.closest(".cds--accordion__item");
      const panelId = button.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      if (!item || !panel) {
        return;
      }

      const willOpen = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(willOpen));
      item.classList.toggle("cds--accordion__item--active", willOpen);
      panel.hidden = !willOpen;
    };

    button.addEventListener("click", toggleItem);

    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleItem();
      }

      if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
        event.preventDefault();
        button.setAttribute("aria-expanded", "false");

        const item = button.closest(".cds--accordion__item");
        const panelId = button.getAttribute("aria-controls");
        const panel = panelId ? document.getElementById(panelId) : null;

        if (item) {
          item.classList.remove("cds--accordion__item--active");
        }

        if (panel) {
          panel.hidden = true;
        }
      }
    });
  });
}

function setupTabsDemo() {
  const tabsDemo = document.querySelector("[data-tabs-demo]");

  if (!tabsDemo) {
    return;
  }

  const tabs = Array.from(tabsDemo.querySelectorAll('[role="tab"]'));
  const panels = Array.from(tabsDemo.querySelectorAll('[role="tabpanel"]'));

  if (tabs.length < 2 || panels.length < 2) {
    return;
  }

  const selectTab = (nextIndex, shouldFocus = false) => {
    tabs.forEach((tab, index) => {
      const selected = index === nextIndex;
      tab.classList.toggle("cds--tabs__nav-item--selected", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.setAttribute("tabindex", selected ? "0" : "-1");

      if (selected && shouldFocus) {
        tab.focus();
      }
    });

    panels.forEach((panel, index) => {
      panel.hidden = index !== nextIndex;
    });
  };

  const moveTo = (currentIndex, direction) => {
    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    selectTab(nextIndex, true);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      selectTab(index);
    });

    tab.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          moveTo(index, 1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          moveTo(index, -1);
          break;
        case "Home":
          event.preventDefault();
          selectTab(0, true);
          break;
        case "End":
          event.preventDefault();
          selectTab(tabs.length - 1, true);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          selectTab(index);
          break;
        default:
          break;
      }
    });
  });
}

function setupTagDemo() {
  const tagActionsRoot = document.getElementById("tag-demo-actions");

  if (!tagActionsRoot) {
    return;
  }

  const dismissButtons = tagActionsRoot.querySelectorAll(".cds--tag__dismiss");

  dismissButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const dismissibleTag = button.closest(".cds--tag");

      if (dismissibleTag) {
        dismissibleTag.remove();
      }
    });
  });

  const selectableTags = tagActionsRoot.querySelectorAll(".cds--tag--selectable");

  selectableTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const pressed = tag.getAttribute("aria-pressed") === "true";
      tag.setAttribute("aria-pressed", String(!pressed));
    });
  });
}

injectEnhancementStyles();
injectNewComponents();
addCarbonNavLinks();
setupVisualizationSelector();
setupAccordionDemo();
setupTabsDemo();
setupTagDemo();

setMenuButtonState(false);
setSwitcherExpanded(false);
syncCurrentFromHash();
