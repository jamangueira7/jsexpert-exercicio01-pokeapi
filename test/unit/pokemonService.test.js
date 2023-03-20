const { describe, it, before, beforeEach, afterEach } = require("mocha");
const sinon = require("sinon");

const { expect } = require("chai");

const PokemonService = require("../../src/service/pokemonService");


const mocks = {
    allPokemons: require("../mocks/allPokemons.json")
}

const repository = {
    getAllPokemons: () => { },
    getPokemon: () => { }
}

const mockRepositoryGetAllPokemons = sinon.stub(repository, 'getAllPokemons');
mockRepositoryGetAllPokemons.resolves(mocks.allPokemons.results);

const mockRepositoryGetPokemon = sinon.stub(repository, 'getPokemon');
mockRepositoryGetPokemon.resolvesArg(0);

describe('PokemonService Suite Tests', () => {

    let pokemonService = {};
    let sandbox = {};

    before(() => {
        pokemonService = new PokemonService({ repository });
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return random pokemon name', async () => {
        const pokemons = [
            { name: 'charmander'},
            { name: 'venusaur' },
            { name: 'blastoise' }
        ];

        sinon.stub(Math, Math.random.name).returns(0);

        const result = await pokemonService.getRandomPokemonName(pokemons);
        const expected = pokemons.map(pokemon => pokemon.name);

        expect(expected).to.contain(result)
        expect(result).to.eql(pokemons[0].name)
    });

    it('should return pokemon team', async () => {
        const getRandomPokemonNameMock = sinon.stub(pokemonService, 'getRandomPokemonName');
        getRandomPokemonNameMock.resolves("kakuna");

        const result = await pokemonService.getTeam();
        const expected = Array.from({ length: 3 }).map(() => 'kakuna');

        expect(expected).to.eql(result)
        expect(repository.getAllPokemons.called).to.be.true
        expect(repository.getPokemon.called).to.be.true
        expect(repository.getPokemon.callCount).to.eql(3)
    });
});