import { capitalizar } from "./utilidades.js";
const containerDetalhes = document.getElementById("detalhes");
// Pega o ID do Pokémon da URL
const parametros = new URLSearchParams(window.location.search);
const idPokemon = parametros.get("id");
// Função para buscar e exibir os detalhes
async function buscarDetalhesPokemon(id) {
    if (!containerDetalhes)
        return;
    containerDetalhes.innerHTML = `<p style="color: #000;">Carregando...</p>`;
    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const dados = await resposta.json();
        // Constrói o HTML com os detalhes do Pokémon
        containerDetalhes.innerHTML = `
            <h2>${capitalizar(dados.name)} (#${dados.id})</h2>
            <img src="${dados.sprites.other["official-artwork"].front_default}" alt="${dados.name}" width="200">
            <p><strong>Tipos:</strong> ${dados.types
            .map((t) => t.type.name)
            .join(", ")}</p>
            <p><strong>Peso:</strong> ${dados.weight / 10} kg</p>
            <p><strong>Altura:</strong> ${dados.height / 10} m</p>
            <p><strong>Experiência Base:</strong> ${dados.base_experience}</p>
        `;
    }
    catch (erro) {
        console.error("Erro ao buscar detalhes:", erro);
        containerDetalhes.innerHTML =
            "<p>Não foi possível carregar os detalhes deste Pokémon.</p>";
    }
}
// Inicia o processo se um ID foi encontrado na URL
if (idPokemon) {
    buscarDetalhesPokemon(idPokemon);
}
else {
    containerDetalhes.innerHTML = "<p>ID do Pokémon não encontrado na URL.</p>";
}
