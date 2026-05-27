const dropdownContainers = document.querySelectorAll("[data-dropdown]");
const dropdownStatus = document.getElementById("dropdown-status");
const radioStatus = document.getElementById("radio-selection-status");
const planRadios = document.querySelectorAll('input[name="radio-plan"]');
const readonlyRadios = document.querySelectorAll('.radio[data-readonly="true"]');

const dropdownControllers = [];

function closeAllDropdowns(exceptContainer = null) {
  dropdownControllers.forEach((controller) => {
    if (controller.container !== exceptContainer) {
      controller.close();
    }
  });
}

function createDropdownController(container) {
  const trigger = container.querySelector(".dropdown-trigger");
  const value = container.querySelector(".dropdown-value");
  const options = Array.from(container.querySelectorAll(".dropdown-option"));

  if (!trigger || !value || options.length === 0) {
    return null;
  }

  const placeholder = trigger.dataset.placeholder || value.textContent.trim();

  let isOpen = false;
  let highlightedIndex = -1;
  let selectedIndex = options.findIndex((option) => option.getAttribute("aria-selected") === "true");

  function setHighlightedIndex(index) {
    highlightedIndex = Math.max(0, Math.min(index, options.length - 1));

    options.forEach((option, optionIndex) => {
      option.classList.toggle("dropdown-option--highlighted", optionIndex === highlightedIndex);
    });

    const highlightedOption = options[highlightedIndex];

    if (highlightedOption && highlightedOption.id) {
      trigger.setAttribute("aria-activedescendant", highlightedOption.id);
    } else {
      trigger.removeAttribute("aria-activedescendant");
    }
  }

  function setSelectedIndex(index) {
    if (index < 0 || index >= options.length) {
      return;
    }

    selectedIndex = index;

    options.forEach((option, optionIndex) => {
      option.setAttribute("aria-selected", String(optionIndex === selectedIndex));
    });

    const selectedOption = options[selectedIndex];
    value.textContent = selectedOption.textContent.trim();
    value.classList.remove("dropdown-value--placeholder");

    if (dropdownStatus) {
      dropdownStatus.textContent = `Opcao selecionada: ${selectedOption.textContent.trim()}.`;
    }
  }

  function clearHighlightedState() {
    options.forEach((option) => {
      option.classList.remove("dropdown-option--highlighted");
    });

    trigger.removeAttribute("aria-activedescendant");
    highlightedIndex = -1;
  }

  function open(preferredIndex = selectedIndex >= 0 ? selectedIndex : 0) {
    closeAllDropdowns(container);

    isOpen = true;
    container.dataset.open = "true";
    trigger.setAttribute("aria-expanded", "true");
    setHighlightedIndex(preferredIndex);
  }

  function close() {
    if (!isOpen) {
      return;
    }

    isOpen = false;
    container.dataset.open = "false";
    trigger.setAttribute("aria-expanded", "false");
    clearHighlightedState();
  }

  function toggle() {
    if (isOpen) {
      close();
      return;
    }

    open();
  }

  function selectHighlighted() {
    if (highlightedIndex < 0) {
      return;
    }

    setSelectedIndex(highlightedIndex);
    close();
  }

  function moveHighlight(step) {
    if (!isOpen) {
      open();
      return;
    }

    if (highlightedIndex < 0) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      return;
    }

    const nextIndex = highlightedIndex + step;
    const loopedIndex = (nextIndex + options.length) % options.length;
    setHighlightedIndex(loopedIndex);
  }

  trigger.addEventListener("click", () => {
    toggle();
  });

  trigger.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveHighlight(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveHighlight(-1);
        break;
      case "Home":
        if (isOpen) {
          event.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      case "End":
        if (isOpen) {
          event.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();

        if (!isOpen) {
          open();
          return;
        }

        selectHighlighted();
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          close();
        }
        break;
      case "Tab":
        close();
        break;
      default:
        break;
    }
  });

  options.forEach((option, optionIndex) => {
    option.addEventListener("click", () => {
      setSelectedIndex(optionIndex);
      close();
      trigger.focus();
    });

    option.addEventListener("mouseenter", () => {
      if (isOpen) {
        setHighlightedIndex(optionIndex);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!container.contains(event.target)) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
    }
  });

  if (selectedIndex >= 0) {
    setSelectedIndex(selectedIndex);
  } else {
    value.textContent = placeholder;
    value.classList.add("dropdown-value--placeholder");
  }

  return {
    container,
    close
  };
}

function lockReadonlyRadios() {
  readonlyRadios.forEach((radio) => {
    const initialValue = radio.checked;

    radio.addEventListener("click", (event) => {
      event.preventDefault();
      radio.checked = initialValue;
    });

    radio.addEventListener("change", () => {
      radio.checked = initialValue;
    });

    radio.addEventListener("keydown", (event) => {
      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
      }
    });
  });
}

function updateRadioStatus() {
  if (!radioStatus || planRadios.length === 0) {
    return;
  }

  const selectedRadio = Array.from(planRadios).find((radio) => radio.checked);

  if (!selectedRadio) {
    radioStatus.textContent = "Nenhuma opcao selecionada.";
    return;
  }

  radioStatus.textContent = `Opcao selecionada: ${selectedRadio.value}.`;
}

dropdownContainers.forEach((container) => {
  const controller = createDropdownController(container);

  if (controller) {
    dropdownControllers.push(controller);
  }
});

planRadios.forEach((radio) => {
  radio.addEventListener("change", updateRadioStatus);
});

lockReadonlyRadios();
updateRadioStatus();
closeAllDropdowns();
