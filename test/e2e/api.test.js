const { describe, it, beforeEach, afterEach, before} = require('mocha');
const request = require('supertest');
const sinon = require("sinon");
const http = require("http");
const assert = require('assert');
const App = require('../../src/app');

const mocks = {
    allPokemons: require("../mocks/allPokemons.json"),
    team: require("../mocks/team.json"),
    pokemon: require("../mocks/pidgeot.json")
}

const SERVER_TEST_PORT = 3001;

describe('API Suite test', () => {
    let api = {};
    let sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('/Routes', () => {
        before(() => {
            const instance = new App();

            api = {
                instance,
                server: instance.createServer(SERVER_TEST_PORT),
            };
        });

        describe("/default", () => {
            it('request default route return status 200', async () => {
                await request(api.server)
                    .get('/')
                    .expect(200);
            });

            it('request default route return default text', async () => {

                const expected = { msg: 'Essa rota não existe, tente acessar a rota /team para retornar dados.' }

                await request(api.server)
                    .get('/')
                    .expect(expected).done;
            });

            it('request default route return content-type json', async () => {
                await request(api.server)
                    .get('/')
                    .expect("Content-Type", /json/);
            });
        });

        describe("/team?name", () => {
            it('request team route with name return pokemon', async () => {

                const expected = {
                    pokemon: mocks.pokemon
                };

                await request(api.server)
                    .get('/team')
                    .query({ name: "pidgeot" })
                    .expect(expected.pokemon);

            });
        });

        describe("/team", () => {
            it('request team route return team pokemon', async () => {

                const expected = {
                    team: mocks.team
                };

                sandbox
                    .stub(api.instance.pokemonService, api.instance.pokemonService.getRandomPokemonName.name)
                    .returns('bulbasaur')
                    .onSecondCall()
                    .returns('charmander')
                    .onThirdCall()
                    .returns('squirtle');


                await request(api.server)
                    .get('/team')
                    .expect(expected.team);
            });
        });
    });
});