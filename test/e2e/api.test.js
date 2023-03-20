const { describe, it, beforeEach, afterEach, before} = require('mocha');
const request = require('supertest');
const { expect } = require("chai");
const sinon = require("sinon");
const http = require("http");
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

    describe("Connection", () => {
        it("should start with server 3000", () => {
            const api = new App();

            sandbox.spy(api);
            sandbox.stub(http, http.createServer.name).returns({
                listen: (port, callback) => {}
            });

            api.createServer();

            expect(api.createServer.getCall(0).args[0]).to.be.equal(undefined);
        });

        it("should start the server on createServer method", () => {
            const api = new App();
            const portTest = 6000;

            sandbox.spy(api);
            sandbox.stub(http, http.createServer.name).returns({
                listen: (port, callback) => {}
            });

            api.createServer(portTest);

            expect(http.createServer.callCount).to.be.equal(1);
            expect(api.createServer.getCall(0).args[0]).to.be.equal(portTest);
        });
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