const button = document.getElementById("action-btn");
const status = document.getElementById("status");

if (button && status) {
  button.addEventListener("click", () => {
    const now = new Date();
    status.textContent = `Atualizado em ${now.toLocaleTimeString("pt-BR")}.`;
  });
}
