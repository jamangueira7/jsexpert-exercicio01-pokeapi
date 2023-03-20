const { describe, it, beforeEach, afterEach, before} = require('mocha');
const request = require('supertest');
const App = require('../../src/app');
const sinon = require("sinon");

const mocks = {
    allPokemons: require("../mocks/allPokemons.json"),
    team: require("../mocks/team.json")
}


describe('API Suite test', () => {
    let api = {};
    let sandbox = {};

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('/', () => {
        before(() => {
            const instance = new App();

            api = {
                instance,
                server: instance.createServer(4000),
            };
        });

        it('request default route return status 200', async () => {
            const response = await request(api.server)
                .get('/')
                .expect(200);
        });

        it('request default route return default text', async () => {

            const expected = { msg: 'Essa rota não existe, tente acessar a rota /team para retornar dados.' }

            const response = await request(api.server)
                .get('/')
                .expect(expected).done;
        });

        it('request default route return content-type json', async () => {
            const response = await request(api.server)
                .get('/')
                .expect("Content-Type", /json/);
        });

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


            const response = await request(api.server)
                .get('/team')
                .expect(expected.team);
        });
    });
});

/*{"team":[{"name":"squirtle","moves":["mega-punch","ice-punch","mega-kick"]},{"name":"wartortle","moves":["mega-punch","ice-punch","mega-kick"]},{"name":"rattata","moves":["cut","headbutt","tackle"]}]}
*/
