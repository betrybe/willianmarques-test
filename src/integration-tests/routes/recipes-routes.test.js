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
    describe('Get /recipes', () => {
        it('Deve retornar 200 com a lista de recipes cadastradas', async () => {
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
            const resGetRecipe = await chai.request(app).get(`/recipes`);
            expect(resGetRecipe).to.have.status(200);
            expect(resGetRecipe.body).to.have.lengthOf(1);
        });
    })
    describe('Get /recipes/:id', () => {
        it('Deve retornar 200 com a recipe do id que foi passado', async () => {
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
            const resGetRecipe = await chai.request(app).get(`/recipes/${resPostRecipe.body.recipe._id}`);
            expect(resGetRecipe).to.have.status(200);
        });
        it('Deve retornar 200 com a recipe do id que foi passado', async () => {
            const resGetRecipe = await chai.request(app).get(`/recipes/recipetrybe`);
            expect(resGetRecipe).to.have.status(404);
            expect(resGetRecipe.body.message).to.be.equal('recipe not found');
        });
    })
    describe('Put /recipes/:id', () => {
        it('Deve retornar 401 ao passar um token inválido', async () => {
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
            const resGetRecipe = await chai.request(app).put(`/recipes/${resPostRecipe.body.recipe._id}`)
            .set({ Authorization: 'token' }).send(recipe);
            expect(resGetRecipe).to.have.status(401);
        });
        it('Deve retornar 400 ao passar dados inválidos (name)', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const recipe = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const recipeToUpdate = {
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: token }).send(recipe);
            expect(resPostRecipe).to.have.status(201);
            const resGetRecipe = await chai.request(app).put(`/recipes/${resPostRecipe.body.recipe._id}`)
            .set({ Authorization: token }).send(recipeToUpdate);
            expect(resGetRecipe).to.have.status(400);
        });
        it('Deve retornar 400 ao passar dados inválidos (ingredients)', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const recipe = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const recipeToUpdate = {
                name: 'bolo de fubá',
                preparation: 'cozinhe'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: token }).send(recipe);
            expect(resPostRecipe).to.have.status(201);
            const resGetRecipe = await chai.request(app).put(`/recipes/${resPostRecipe.body.recipe._id}`)
            .set({ Authorization: token }).send(recipeToUpdate);
            expect(resGetRecipe).to.have.status(400);
        });
        it('Deve retornar 400 ao passar dados inválidos (preparation)', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const recipe = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const recipeToUpdate = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: token }).send(recipe);
            expect(resPostRecipe).to.have.status(201);
            const resGetRecipe = await chai.request(app).put(`/recipes/${resPostRecipe.body.recipe._id}`)
            .set({ Authorization: token }).send(recipeToUpdate);
            expect(resGetRecipe).to.have.status(400);
        });
        it('Deve retornar 401 ao tentar fazer update em uma receita de outro usuario com role user', async () => {
            const loginCorrect = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const loginIncorrect = { 
                email: 'erickjacquin@gmail.com', 
                password: '12345678',
            }
            const recipe = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const recipeToUpdate = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const resLoginCorrectUser = await chai.request(app).post(`/login`).send(loginCorrect);
            expect(resLoginCorrectUser).to.have.status(200);
            const tokenCorrectUser = resLoginCorrectUser.body.token;

            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: tokenCorrectUser }).send(recipe);
            expect(resPostRecipe).to.have.status(201);

            const resLoginIncorrectUser = await chai.request(app).post(`/login`).send(loginIncorrect);
            expect(resLoginIncorrectUser).to.have.status(200);
            const tokenIncorrectUser = resLoginIncorrectUser.body.token;

            const resGetRecipe = await chai.request(app).put(`/recipes/${resPostRecipe.body.recipe._id}`)
            .set({ Authorization: tokenIncorrectUser }).send(recipeToUpdate);
            expect(resGetRecipe).to.have.status(401);
        });
        it('Deve retornar 401 ao tentar fazer update em uma receita sem o token', async () => {
            const resGetRecipe = await chai.request(app).put(`/recipes/tryberecipe`)
            .set({ Authorization: '' }).send();
            expect(resGetRecipe).to.have.status(401);
        });
        it('Deve retornar 200 ao passar dados válidos com o user dono da recipe', async () => {
            const login = { 
                email: 'erickjacquin@gmail.com', 
                password: '12345678',
            }
            const recipe = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const recipeToUpdate = {
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
            const resGetRecipe = await chai.request(app).put(`/recipes/${resPostRecipe.body.recipe._id}`)
            .set({ Authorization: token }).send(recipeToUpdate);
            expect(resGetRecipe).to.have.status(200);
        });
        it('Deve retornar 200 ao passar dados válidos com o user admin', async () => {
            const login = { 
                email: 'erickjacquin@gmail.com', 
                password: '12345678',
            }
            const loginAdmin = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const recipe = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const recipeToUpdate = {
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

            const resLoginAdmin = await chai.request(app).post(`/login`).send(loginAdmin);
            expect(resLoginAdmin).to.have.status(200);
            const tokenAdmin = resLoginAdmin.body.token;

            const resGetRecipe = await chai.request(app).put(`/recipes/${resPostRecipe.body.recipe._id}`)
            .set({ Authorization: tokenAdmin }).send(recipeToUpdate);
            expect(resGetRecipe).to.have.status(200);
        });
    })
});