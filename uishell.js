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

setMenuButtonState(false);
setSwitcherExpanded(false);
syncCurrentFromHash();
