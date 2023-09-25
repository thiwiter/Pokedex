const pokeApi = {};

pokeApi.getPokemonList = (offset = 0, limit = 12) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;

    return fetch(url) 
        .then(response => response.json())
        .then(responseBody => responseBody.results)
        .then(pokemonSimpleList => pokemonSimpleList.map(pokeApi.getPokemonDetails))
        .then(listOfPromisses => Promise.all(listOfPromisses))
        .then(pokemonDetailedList => pokemonDetailedList.map((detail) => convertPokemonDetailsToPokemon(detail)))
        .catch(error => console.error(error));
}

pokeApi.getPokemon = id => {
    return pokeApi.getPokemonDetailsById(id)
        .then(pokemonDetails => convertPokemonDetailsToPokemon(pokemonDetails, false))
        .catch(error => console.error(error));
}

pokeApi.getPokemonDetails = pokemon => {
    return fetch(pokemon.url).then(response => response.json());
}

pokeApi.getPokemonDetailsById = id => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(response => response.json());
}

function convertPokemonDetailsToPokemon(pokemonDetails, short = true) {
    const pokemon = new Pokemon();
    pokemon.id = String(pokemonDetails.id);
    pokemon.name = pokemonDetails.name;
    pokemon.types = pokemonDetails.types.map(typeSlot => typeSlot.type.name);
    pokemon.mainType = pokemon.types[0];
    pokemon.imgUrl = pokeApi.getImgUrl(pokemon.id);

    if (short) return pokemon;

    pokemon.weight = pokemonDetails.weight / 10;
    pokemon.height = pokemonDetails.height / 10;
    pokemon.stats = {
        hp: pokemonDetails.stats[0].base_stat, 
        attack: pokemonDetails.stats[1].base_stat, 
        defense: pokemonDetails.stats[2].base_stat, 
        specialAttack: pokemonDetails.stats[3].base_stat, 
        specialDefense: pokemonDetails.stats[4].base_stat, 
        speed: pokemonDetails.stats[5].base_stat 
    }

    pokemon.abilities = pokemonDetails.abilities.map(slot => slot.ability.name);

    return pokemon;
}

pokeApi.getImgUrl = id => {
    return `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${id.padStart(3,'0')}.png`
}