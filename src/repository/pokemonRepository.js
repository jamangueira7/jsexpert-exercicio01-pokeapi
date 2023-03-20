const PokemonApi = require('../api');

class PokemonRepository {
  constructor() {
    this.api = new PokemonApi();
  }

  async getAllPokemons() {
    const pokemons = await this.api.get('pokemon');
    return pokemons.results;
  }

  async getPokemon(pokemon) {
    try {
      const data = await this.api.get(`pokemon/${pokemon}`);

      const { name, moves } = data;

      return {
        name,
        moves: moves.slice(0, 3).map(move => move.move.name),
      };

    } catch (error) {
      return { error: `${pokemon} não existe. Verifique a ortografia.`}
    }
  }
}

module.exports = PokemonRepository;
