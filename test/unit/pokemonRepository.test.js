const { describe, it, before, beforeEach, afterEach } = require("mocha");
const sinon = require("sinon");

const { join } = require("path");
const { expect } = require("chai");

const PokemonRepository = require("../../src/repository/pokemonRepository");
const PokemonAPI = require("../../src/api");

const mocks = {
    allPokemons: require("../mocks/allPokemons.json"),
    pidgeot: require("../mocks/pidgeot.json"),
    pidgeotError: require("../mocks/pidgeotError.json"),
}

describe('PokemonRepository Suite Tests', () => {

    let pokemonRepository = {};
    let sandbox = {};

    before(() => {
        pokemonRepository = new PokemonRepository();
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return all Pokemons', async () => {
        const result = await pokemonRepository.getAllPokemons();

        const expected = mocks.allPokemons.results;

        expect(result).to.eql(expected)
    });

    it('should return all Pokemons by ID - Pokemon pidgeot', async () => {
        const result = await pokemonRepository.getPokemon('pidgeot');

        const expected = mocks.pidgeot;

        expect(result).to.eql(expected);
        expect(result.moves.length).to.eql(3);
    });

    it('should return all Pokemons by ID error', async () => {
        const result = await pokemonRepository.getPokemon('fdafds');

        const expected = mocks.pidgeotError;

        expect(result).to.eql(expected);
    });
});