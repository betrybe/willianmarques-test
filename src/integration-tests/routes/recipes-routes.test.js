const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../api/app');
const mongoHelper = require('../../infra/mongo-helper');
const expect = chai.expect;
chai.use(chaiHttp);

let userModel;
let recipeModel;

describe('Recipes Routes', () => {
    before(async () => {
        userModel = await mongoHelper.getCollection('users');
        recipeModel = await mongoHelper.getCollection('recipes');
    })
    beforeEach(async () => {
        await userModel.deleteMany({});
        await recipeModel.deleteMany({});
        const users = [
            { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' },
            { name: 'Erick Jacquin', email: 'erickjacquin@gmail.com', password: '12345678', role: 'user' },
        ];
        await userModel.insertMany(users);
    });

    describe('Post /recipes', () => {
        it('Deve retornar 200 caso um usuário autenticado tente cadastrar recipe', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const recipe = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: token }).send(recipe);
            expect(resPostRecipe).to.have.status(201);
        })
        it('Deve retornar 401 caso um usuário não autenticado tente cadastrar recipe', async () => {
            const recipe = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const token = 'faketokentrybe';
            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: token }).send(recipe);
            expect(resPostRecipe).to.have.status(401);
        })
        it('Deve retornar 403 caso envie dados inválidos (name)', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const recipe = {
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: token }).send(recipe);
            expect(resPostRecipe).to.have.status(400);
            expect(resPostRecipe.body.message).to.be.equal('Invalid entries. Try again.');
        })
        it('Deve retornar 403 caso envie dados inválidos (ingredients)', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const recipe = {
                name: 'bolo de fubá',
                preparation: 'cozinhe'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: token }).send(recipe);
            expect(resPostRecipe).to.have.status(400);
            expect(resPostRecipe.body.message).to.be.equal('Invalid entries. Try again.');
        })
        it('Deve retornar 403 caso envie dados inválidos (preparation)', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const recipe = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: token }).send(recipe);
            expect(resPostRecipe).to.have.status(400);
            expect(resPostRecipe.body.message).to.be.equal('Invalid entries. Try again.');
        })
    })
});