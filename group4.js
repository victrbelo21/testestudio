function injectGroupFourNavLinks() {
  const headerSubmenu = document.getElementById("header-submenu-components");
  if (headerSubmenu && !headerSubmenu.querySelector('a[href="#component-progress-indicator"]')) {
    headerSubmenu.insertAdjacentHTML(
      "beforeend",
      `
        <li><a class="cds--header__submenu-item" href="#component-progress-indicator" role="menuitem">Progress indicator</a></li>
        <li><a class="cds--header__submenu-item" href="#component-tooltip" role="menuitem">Tooltip</a></li>
        <li><a class="cds--header__submenu-item" href="#component-breadcrumb" role="menuitem">Breadcrumb</a></li>
      `
    );
  }

  const sideNavRoot = document.querySelector(".cds--side-nav__items");
  if (sideNavRoot && !document.querySelector('[aria-controls="side-nav-group-4"]')) {
    sideNavRoot.insertAdjacentHTML(
      "beforeend",
      `
        <li class="cds--side-nav__item is-open">
          <button class="cds--side-nav__submenu" type="button" aria-expanded="true" aria-controls="side-nav-group-4">
            <span class="cds--side-nav__submenu-title">Grupo 4</span>
            <span class="cds--side-nav__submenu-chevron" aria-hidden="true">▾</span>
          </button>
          <ul id="side-nav-group-4" class="cds--side-nav__menu">
            <li class="cds--side-nav__menu-item"><a class="cds--side-nav__link" href="#component-progress-indicator"><span class="cds--side-nav__link-text">Progress indicator</span></a></li>
            <li class="cds--side-nav__menu-item"><a class="cds--side-nav__link" href="#component-tooltip"><span class="cds--side-nav__link-text">Tooltip</span></a></li>
            <li class="cds--side-nav__menu-item"><a class="cds--side-nav__link" href="#component-breadcrumb"><span class="cds--side-nav__link-text">Breadcrumb</span></a></li>
          </ul>
        </li>
      `
    );

    const newSubmenuButton = document.querySelector('[aria-controls="side-nav-group-4"]');
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

function injectGroupFourComponents() {
  const main = document.getElementById("main-content");
  const paletteSection = document.getElementById("palette");
  if (!main || document.getElementById("group-4")) {
    return;
  }

  const template = document.createElement("template");
  template.innerHTML = `
    <section class="card card--full" id="group-4">
      <h1>Grupo 4/3: Progress indicator, Tooltip e Breadcrumb</h1>
      <p>Mais 3 componentes baseados no diretório de componentes do Carbon React.</p>
      <div class="component-visualization-selector" data-visualization-group="group-4">
        <label class="text-input-label" for="component-view-select-group-4">Escolha a visualização</label>
        <div class="select-field-wrapper">
          <select id="component-view-select-group-4" class="select-input select-input--md" aria-describedby="component-view-helper-group-4">
            <option value="progress" selected>Progress indicator</option>
            <option value="tooltip">Tooltip</option>
            <option value="breadcrumb">Breadcrumb</option>
          </select>
          <span class="select-arrow" aria-hidden="true">&#9662;</span>
        </div>
        <p id="component-view-helper-group-4" class="text-input-helper">Quando há 3+ opções, o dropdown mostra só a opção selecionada.</p>
      </div>
    </section>

    <section class="card card--half component-view-card component-view-card--group-4" id="component-progress-indicator" data-view-option="progress" data-view-group="group-4">
      <h2>Progress indicator</h2>
      <ol class="cds--progress" id="progress-demo">
        <li class="cds--progress-step is-complete"><button type="button" class="cds--progress-step-button" data-step="0">Start</button></li>
        <li class="cds--progress-step is-current"><button type="button" class="cds--progress-step-button" data-step="1">Configuração</button></li>
        <li class="cds--progress-step"><button type="button" class="cds--progress-step-button" data-step="2">Review</button></li>
        <li class="cds--progress-step"><button type="button" class="cds--progress-step-button" data-step="3">Done</button></li>
      </ol>
      <p id="progress-status" class="component-status">Etapa atual: Configuração.</p>
    </section>

    <section class="card card--half component-view-card component-view-card--group-4" id="component-tooltip" data-view-option="tooltip" data-view-group="group-4" hidden>
      <h2>Tooltip</h2>
      <p>
        Passe o mouse ou foco no botão:
        <span class="tooltip-wrapper">
          <button class="btn btn-tertiary btn-size-sm" type="button" id="tooltip-trigger" aria-describedby="tooltip-content">Info</button>
          <span id="tooltip-content" class="cds--tooltip" role="tooltip">Este é um tooltip no padrão Carbon.</span>
        </span>
      </p>
    </section>

    <section class="card card--half component-view-card component-view-card--group-4" id="component-breadcrumb" data-view-option="breadcrumb" data-view-group="group-4" hidden>
      <h2>Breadcrumb</h2>
      <nav aria-label="Breadcrumb" class="cds--breadcrumb">
        <ol class="cds--breadcrumb-list">
          <li><a href="#component-uishell">Home</a></li>
          <li><a href="#group-4">Grupo 4</a></li>
          <li aria-current="page">Breadcrumb</li>
        </ol>
      </nav>
    </section>
  `;

  if (paletteSection) {
    main.insertBefore(template.content, paletteSection);
  } else {
    main.appendChild(template.content);
  }
}

function setupVisualizationSelectorByGroup(groupName, selectId) {
  const select = document.getElementById(selectId);
  const cards = document.querySelectorAll(`.component-view-card[data-view-group="${groupName}"]`);
  if (!select || cards.length < 3) {
    return;
  }

  const applySelection = (value) => {
    cards.forEach((card) => {
      const shouldShow = card.getAttribute("data-view-option") === value;
      card.hidden = !shouldShow;
      card.setAttribute("aria-hidden", String(!shouldShow));
    });
  };

  applySelection(select.value);
  select.addEventListener("change", () => applySelection(select.value));
}

function setupProgressIndicatorDemo() {
  const root = document.getElementById("progress-demo");
  const status = document.getElementById("progress-status");
  if (!root || !status) {
    return;
  }

  const steps = Array.from(root.querySelectorAll(".cds--progress-step"));
  const labels = ["Start", "Configuração", "Review", "Done"];

  const setStep = (index) => {
    steps.forEach((step, i) => {
      step.classList.toggle("is-complete", i < index);
      step.classList.toggle("is-current", i === index);
    });
    status.textContent = `Etapa atual: ${labels[index]}.`;
  };

  steps.forEach((step, index) => {
    const button = step.querySelector(".cds--progress-step-button");
    if (!button) {
      return;
    }
    button.addEventListener("click", () => setStep(index));
  });
}

injectGroupFourComponents();
injectGroupFourNavLinks();
setupVisualizationSelectorByGroup("group-4", "component-view-select-group-4");
setupProgressIndicatorDemo();
