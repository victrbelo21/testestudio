// comunicacoes.js

document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("main");

    const wrapper = document.createElement("div");
    wrapper.className = "dropdown-wrapper";

    wrapper.innerHTML = `
        <label for="exemplos-select">Escolha um exemplo:</label>

        <select id="exemplos-select">
            <option value="">Selecione...</option>
            <option value="email">Exemplo de e-mail</option>
            <option value="aviso">Exemplo de aviso interno</option>
            <option value="comunicado">Exemplo de comunicado</option>
            <option value="post">Exemplo de post</option>
        </select>

        <p id="exemplo-texto"></p>
    `;

    main.appendChild(wrapper);

    const select = document.getElementById("exemplos-select");
    const texto = document.getElementById("exemplo-texto");

    const exemplos = {
        email: "Olá, time! Compartilhamos uma atualização importante sobre o projeto.",
        aviso: "Atenção: haverá manutenção programada no sistema nesta sexta-feira.",
        comunicado: "Informamos que uma nova etapa da iniciativa será lançada em breve.",
        post: "Novidade chegando! Fique por dentro das próximas comunicações."
    };

    select.addEventListener("change", () => {
        const valor = select.value;
        texto.textContent = exemplos[valor] || "";
    });
});
