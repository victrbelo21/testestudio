function injectGroupFiveNavLinks() {
  const headerSubmenu = document.getElementById("header-submenu-components");
  if (headerSubmenu && !headerSubmenu.querySelector('a[href="#component-datatable"]')) {
    headerSubmenu.insertAdjacentHTML(
      "beforeend",
      `
        <li><a class="cds--header__submenu-item" href="#component-datatable" role="menuitem">DataTable</a></li>
        <li><a class="cds--header__submenu-item" href="#component-datatable-skeleton" role="menuitem">DataTableSkeleton</a></li>
        <li><a class="cds--header__submenu-item" href="#component-datepicker" role="menuitem">DatePicker</a></li>
        <li><a class="cds--header__submenu-item" href="#component-datepicker-input" role="menuitem">DatePickerInput</a></li>
        <li><a class="cds--header__submenu-item" href="#component-dialog" role="menuitem">Dialog</a></li>
        <li><a class="cds--header__submenu-item" href="#component-disclosure" role="menuitem">Disclosure</a></li>
      `
    );
  }

  const sideNavRoot = document.querySelector(".cds--side-nav__items");
  if (sideNavRoot && !document.querySelector('[aria-controls="side-nav-group-5"]')) {
    sideNavRoot.insertAdjacentHTML(
      "beforeend",
      `
        <li class="cds--side-nav__item is-open">
          <button class="cds--side-nav__submenu" type="button" aria-expanded="true" aria-controls="side-nav-group-5">
            <span class="cds--side-nav__submenu-title">Grupo 5</span>
            <span class="cds--side-nav__submenu-chevron" aria-hidden="true">▾</span>
          </button>
          <ul id="side-nav-group-5" class="cds--side-nav__menu">
            <li class="cds--side-nav__menu-item"><a class="cds--side-nav__link" href="#component-datatable"><span class="cds--side-nav__link-text">DataTable</span></a></li>
            <li class="cds--side-nav__menu-item"><a class="cds--side-nav__link" href="#component-datatable-skeleton"><span class="cds--side-nav__link-text">DataTableSkeleton</span></a></li>
            <li class="cds--side-nav__menu-item"><a class="cds--side-nav__link" href="#component-datepicker"><span class="cds--side-nav__link-text">DatePicker</span></a></li>
            <li class="cds--side-nav__menu-item"><a class="cds--side-nav__link" href="#component-datepicker-input"><span class="cds--side-nav__link-text">DatePickerInput</span></a></li>
            <li class="cds--side-nav__menu-item"><a class="cds--side-nav__link" href="#component-dialog"><span class="cds--side-nav__link-text">Dialog</span></a></li>
            <li class="cds--side-nav__menu-item"><a class="cds--side-nav__link" href="#component-disclosure"><span class="cds--side-nav__link-text">Disclosure</span></a></li>
          </ul>
        </li>
      `
    );
  }
}

function injectGroupFiveComponents() {
  const main = document.getElementById("main-content");
  const paletteSection = document.getElementById("palette");
  if (!main || document.getElementById("group-5")) {
    return;
  }

  const template = document.createElement("template");
  template.innerHTML = `
    <section class="card card--full" id="group-5">
      <h1>Grupo 5: DataTable, DataTableSkeleton, DatePicker, DatePickerInput, Dialog e Disclosure</h1>
      <p>Novos componentes solicitados com base no Carbon.</p>

      <div class="component-visualization-selector" data-visualization-group="group-5-a">
        <label class="text-input-label" for="component-view-select-group-5a">Visualização (tabela)</label>
        <div class="select-field-wrapper">
          <select id="component-view-select-group-5a" class="select-input select-input--md">
            <option value="datatable" selected>DataTable</option>
            <option value="datatable-skeleton">DataTableSkeleton</option>
            <option value="datepicker">DatePicker</option>
          </select>
          <span class="select-arrow" aria-hidden="true">&#9662;</span>
        </div>
      </div>

      <div class="component-visualization-selector" data-visualization-group="group-5-b">
        <label class="text-input-label" for="component-view-select-group-5b">Visualização (inputs e overlays)</label>
        <div class="select-field-wrapper">
          <select id="component-view-select-group-5b" class="select-input select-input--md">
            <option value="datepicker-input" selected>DatePickerInput</option>
            <option value="dialog">Dialog</option>
            <option value="disclosure">Disclosure</option>
          </select>
          <span class="select-arrow" aria-hidden="true">&#9662;</span>
        </div>
      </div>
    </section>

    <section class="card card--full component-view-card" id="component-datatable" data-view-option="datatable" data-view-group="group-5-a">
      <h2>DataTable</h2>
      <div class="cds--data-table-container">
        <table class="cds--data-table">
          <thead>
            <tr><th>Nome</th><th>Status</th><th>Owner</th></tr>
          </thead>
          <tbody>
            <tr><td>Build 001</td><td>Ativo</td><td>Victor</td></tr>
            <tr><td>Build 002</td><td>Pendente</td><td>Equipe UI</td></tr>
            <tr><td>Build 003</td><td>Concluído</td><td>QA</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="card card--full component-view-card" id="component-datatable-skeleton" data-view-option="datatable-skeleton" data-view-group="group-5-a" hidden>
      <h2>DataTableSkeleton</h2>
      <div class="cds--data-table-container cds--data-table-skeleton">
        <table class="cds--data-table">
          <thead>
            <tr><th>Nome</th><th>Status</th><th>Owner</th></tr>
          </thead>
          <tbody>
            <tr><td><div class="skeleton-line"></div></td><td><div class="skeleton-line"></div></td><td><div class="skeleton-line"></div></td></tr>
            <tr><td><div class="skeleton-line"></div></td><td><div class="skeleton-line"></div></td><td><div class="skeleton-line"></div></td></tr>
            <tr><td><div class="skeleton-line"></div></td><td><div class="skeleton-line"></div></td><td><div class="skeleton-line"></div></td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="card card--full component-view-card" id="component-datepicker" data-view-option="datepicker" data-view-group="group-5-a" hidden>
      <h2>DatePicker</h2>
      <div class="datepicker-grid">
        <div>
          <label class="text-input-label" for="date-start">Data inicial</label>
          <input id="date-start" class="cds--date-picker-input" type="date" />
        </div>
        <div>
          <label class="text-input-label" for="date-end">Data final</label>
          <input id="date-end" class="cds--date-picker-input" type="date" />
        </div>
      </div>
    </section>

    <section class="card card--full component-view-card" id="component-datepicker-input" data-view-option="datepicker-input" data-view-group="group-5-b">
      <h2>DatePickerInput</h2>
      <label class="text-input-label" for="date-single">Escolha uma data</label>
      <input id="date-single" class="cds--date-picker-input" type="date" />
    </section>

    <section class="card card--full component-view-card" id="component-dialog" data-view-option="dialog" data-view-group="group-5-b" hidden>
      <h2>Dialog</h2>
      <button id="open-dialog" class="btn btn-primary btn-size-md" type="button">Abrir dialog</button>
      <div id="dialog-backdrop" class="dialog-backdrop" hidden>
        <div class="cds--dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <h3 id="dialog-title">Confirmar ação</h3>
          <p>Este é um dialog no padrão de layout Carbon.</p>
          <div class="dialog-actions">
            <button id="close-dialog" class="btn btn-secondary btn-size-sm" type="button">Cancelar</button>
            <button class="btn btn-primary btn-size-sm" type="button">Confirmar</button>
          </div>
        </div>
      </div>
    </section>

    <section class="card card--full component-view-card" id="component-disclosure" data-view-option="disclosure" data-view-group="group-5-b" hidden>
      <h2>Disclosure</h2>
      <details class="cds--disclosure" open>
        <summary>Detalhes da configuração</summary>
        <div class="cds--disclosure-content">
          Este conteúdo pode ser expandido/recolhido para reduzir ruído visual na tela.
        </div>
      </details>
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

function setupDialogDemo() {
  const openButton = document.getElementById("open-dialog");
  const closeButton = document.getElementById("close-dialog");
  const backdrop = document.getElementById("dialog-backdrop");

  if (!openButton || !closeButton || !backdrop) {
    return;
  }

  openButton.addEventListener("click", () => {
    backdrop.hidden = false;
  });

  closeButton.addEventListener("click", () => {
    backdrop.hidden = true;
  });

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      backdrop.hidden = true;
    }
  });
}

injectGroupFiveComponents();
injectGroupFiveNavLinks();
setupVisualizationSelectorByGroup("group-5-a", "component-view-select-group-5a");
setupVisualizationSelectorByGroup("group-5-b", "component-view-select-group-5b");
setupDialogDemo();
