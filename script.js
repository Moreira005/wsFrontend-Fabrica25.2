import { capitalizar } from "./utilidades.js";
// ELEMENTOS DO DOM
const containerPokemons = document.getElementById("pokemonContainer");
const inputBusca = document.getElementById("procurarInput");
const formularioBusca = document.getElementById("procurarPokemon");
const botaoAlternar = document.getElementById("botaoAlternar");
// "BANCO DE DADOS" LOCAL
let todosOsPokemons = [];
let modoVisualizacao = "grade";
// FUNÇÕES
function renderizarPokemons(listaDePokemons) {
    if (!containerPokemons)
        return;
    if (listaDePokemons.length === 0) {
        containerPokemons.innerHTML = `<p style="color: white; text-align: center;">Nenhum Pokémon encontrado.</p>`;
        return;
    }
    const htmlDosCards = listaDePokemons.map(criarCardPokemon).join("");
    containerPokemons.innerHTML = htmlDosCards;
}
function criarCardPokemon(pokemon) {
    const urlDaImagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    // Usando 'pokemon.nome' em vez de 'pokemon.name'
    const htmlDoCard = `
    <article class="pokemonCard" onclick="window.location.href='detalhes.html?id=${pokemon.id}'">
      <figure class="pokemonImagemCard">
        <img src="${urlDaImagem}" alt="Imagem do Pokémon ${capitalizar(pokemon.nome)}" loading="lazy" />
      </figure>
      <div class="pokemonInformacaoCard">
        <span class="pokemonIdCard">#${String(pokemon.id).padStart(3, "0")}</span>
        <h3 class="pokemonNomeCard">${capitalizar(pokemon.nome)}</h3>
      </div>
    </article>
  `;
    return htmlDoCard;
}
async function buscarTodosOsPokemons() {
    try {
        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1161");
        const dados = await resposta.json();
        // Usando 'nome: p.name' para criar a propriedade 'nome'
        todosOsPokemons = dados.results.map((p) => {
            const partesDaUrl = p.url.split("/");
            const id = parseInt(partesDaUrl[partesDaUrl.length - 2]);
            return { id: id, nome: p.name };
        });
        renderizarPokemons(todosOsPokemons);
    }
    catch (erro) {
        console.error("Falha ao buscar os Pokémons:", erro);
        containerPokemons.innerHTML =
            "<p>Não foi possível carregar os Pokémons.</p>";
    }
}
function manipularBusca() {
    const termoDeBusca = inputBusca.value.toLowerCase();
    // Usando 'pokemon.nome' na lógica do filtro
    const pokemonsFiltrados = todosOsPokemons.filter((pokemon) => pokemon.nome.toLowerCase().includes(termoDeBusca));
    renderizarPokemons(pokemonsFiltrados);
}
botaoAlternar.addEventListener("click", () => {
    if (modoVisualizacao === "grade") {
        modoVisualizacao = "lista";
        containerPokemons.classList.remove("grade");
        containerPokemons.classList.add("lista");
        botaoAlternar.innerText = "Mudar para Grade";
    }
    else {
        modoVisualizacao = "grade";
        containerPokemons.classList.remove("lista");
        containerPokemons.classList.add("grade");
        botaoAlternar.innerText = "Mudar para Lista";
    }
});
// EVENTOS
inputBusca.addEventListener("input", manipularBusca);
formularioBusca.addEventListener("submit", (evento) => evento.preventDefault());
// INICIALIZAÇÃO
buscarTodosOsPokemons();
