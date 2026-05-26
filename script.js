const button = document.getElementById('action-btn');
const status = document.getElementById('status');

button.addEventListener('click', () => {
  const now = new Date();
  status.textContent = `Botao clicado em ${now.toLocaleTimeString('pt-BR')}.`;
});
