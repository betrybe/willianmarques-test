const chai = require('chai');
const chaiHttp = require('chai-http');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
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
        it('Deve retornar 404 se nãot tiver nenhum recipe cadastrada', async () => {
            await recipeModel.deleteMany({});
            const resGetRecipe = await chai.request(app).get(`/recipes`);
            console.log(resGetRecipe.body);
            expect(resGetRecipe).to.have.status(404);
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
        it('Deve retornar 404 ao passar um id não existente', async () => {
            const id = new ObjectId();
            const resGetRecipe = await chai.request(app).get(`/recipes/${id}`);
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
        it('Deve retornar 404 ao passar um id não existente', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const recipeToUpdate = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }

            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;

            const id = new ObjectId();

            const resGetRecipe = await chai.request(app).put(`/recipes/${id}`)
            .set({ Authorization: token }).send(recipeToUpdate);
            expect(resGetRecipe).to.have.status(404);
            expect(resGetRecipe.body.message).to.be.equal('recipe not found');
        });
        it('Deve retornar 404 ao passar um id inválido', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const recipeToUpdate = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }

            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;

            const resGetRecipe = await chai.request(app).put(`/recipes/testetrybe`)
            .set({ Authorization: token }).send(recipeToUpdate);
            expect(resGetRecipe).to.have.status(404);
            expect(resGetRecipe.body.message).to.be.equal('recipe not found');
        });
    })
    describe('Delete /recipes/:id', () => {
        it('Deve retornar 401 ao passar um token inválido (fora do formato)', async () => {
            const resDeleteRecipe = await chai.request(app).delete(`/recipes/tryberecipe`)
            .set({ Authorization: 'token' });
            expect(resDeleteRecipe).to.have.status(401);
        });
        it('Deve retornar 401 ao passar um token inválido (vazio)', async () => {
            const resDeleteRecipe = await chai.request(app).delete(`/recipes/tryberecipe`)
            .set({ Authorization: '' });
            expect(resDeleteRecipe).to.have.status(401);
        });
        it('Deve retornar 404 ao passar um id não existente', async () => {
            const id = new ObjectId();
            const login = { 
                email: 'erickjacquin@gmail.com', 
                password: '12345678',
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
            const resGetRecipe = await chai.request(app).delete(`/recipes/${id}`)
            .set({ Authorization: token });
            expect(resGetRecipe).to.have.status(404);
        });
        it('Deve retornar 401 ao passar um user não autorizado para deletar', async () => {
            const id = new ObjectId();
            const loginAdmin = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const login = { 
                email: 'erickjacquin@gmail.com', 
                password: '12345678',
            }
            const recipe = {
                name: 'bolo de fubá',
                ingredients: 'arroz, feijão e ovo',
                preparation: 'cozinhe'
            }
            const resLoginAdmin = await chai.request(app).post(`/login`).send(loginAdmin);
            expect(resLoginAdmin).to.have.status(200);
            const tokenAdmin = resLoginAdmin.body.token;

            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: tokenAdmin }).send(recipe);
            expect(resPostRecipe).to.have.status(201);

            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;

            const resGetRecipe = await chai.request(app).delete(`/recipes/${resPostRecipe.body.recipe._id}`)
            .set({ Authorization: token });
            expect(resGetRecipe).to.have.status(401);
        });
        it('Deve retornar 404 ao passar dados inválidos (id recipe)', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resDeleteRecipe = await chai.request(app).delete(`/recipes/tryberecipe`)
            .set({ Authorization: token });
            expect(resDeleteRecipe).to.have.status(404);
        });
        it('Deve retornar 204 ao passar dados válidos para deletar recipe sendo user dono da recipe', async () => {
            const login = { 
                email: 'erickjacquin@gmail.com', 
                password: '12345678',
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
            const resGetRecipe = await chai.request(app).delete(`/recipes/${resPostRecipe.body.recipe._id}`)
            .set({ Authorization: token });
            expect(resGetRecipe).to.have.status(204);
        });
        it('Deve retornar 204 ao passar dados válidos para deletar recipe sendo user admin', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin',
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
            const resGetRecipe = await chai.request(app).delete(`/recipes/${resPostRecipe.body.recipe._id}`)
            .set({ Authorization: token });
            expect(resGetRecipe).to.have.status(204);
        });
    })
    describe('Update /recipes/:id/image', () => {
        it('Deve retornar 200 ao enviar uma foto estando autenticado como usuário dono da receita', async () => {
            const login = {
                email: 'erickjacquin@gmail.com', 
                password: '12345678',
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
            const photoFile = path.resolve(__dirname, '../../uploads/ratinho.jpg');
            const content = fs.createReadStream(photoFile);
            const respUpdateImage = await chai.request(app)
            .put(`/recipes/${resPostRecipe.body.recipe._id}/image`)
            .attach('image', content)
            .set({ Authorization: token });
            expect(respUpdateImage).to.have.status(200);
            expect(respUpdateImage.body.image).to.be.equal(`localhost:3000/src/uploads/${respUpdateImage.body._id}.jpeg`);
            expect(respUpdateImage.body).to.haveOwnProperty('_id');
            expect(respUpdateImage.body).to.haveOwnProperty('userId');
            expect(respUpdateImage.body).to.haveOwnProperty('name');
            expect(respUpdateImage.body).to.haveOwnProperty('ingredients');
            expect(respUpdateImage.body).to.haveOwnProperty('preparation');
        })
        it('Deve retornar 200 ao enviar uma foto estando autenticado como usuário admin', async () => {
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
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: token }).send(recipe);
            expect(resPostRecipe).to.have.status(201);

            const resLoginAdmin = await chai.request(app).post(`/login`).send(loginAdmin);
            expect(resLoginAdmin).to.have.status(200);
            const tokenAdmin = resLoginAdmin.body.token;

            const photoFile = path.resolve(__dirname, '../../uploads/ratinho.jpg');
            const content = fs.createReadStream(photoFile);
            const respUpdateImage = await chai.request(app)
            .put(`/recipes/${resPostRecipe.body.recipe._id}/image`)
            .attach('image', content)
            .set({ Authorization: tokenAdmin });
            expect(respUpdateImage).to.have.status(200);
            expect(respUpdateImage.body.image).to.be.equal(`localhost:3000/src/uploads/${respUpdateImage.body._id}.jpeg`);
            expect(respUpdateImage.body).to.haveOwnProperty('_id');
            expect(respUpdateImage.body).to.haveOwnProperty('userId');
            expect(respUpdateImage.body).to.haveOwnProperty('name');
            expect(respUpdateImage.body).to.haveOwnProperty('ingredients');
            expect(respUpdateImage.body).to.haveOwnProperty('preparation');
        })
        it('Deve retornar 404 ao enviar um id não cadastrado', async () => {
            const id = new ObjectId();
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
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: token }).send(recipe);
            expect(resPostRecipe).to.have.status(201);

            const resLoginAdmin = await chai.request(app).post(`/login`).send(loginAdmin);
            expect(resLoginAdmin).to.have.status(200);
            const tokenAdmin = resLoginAdmin.body.token;

            const photoFile = path.resolve(__dirname, '../../uploads/ratinho.jpg');
            const content = fs.createReadStream(photoFile);
            const respUpdateImage = await chai.request(app)
            .put(`/recipes/${id}/image`)
            .attach('image', content)
            .set({ Authorization: tokenAdmin });
            expect(respUpdateImage).to.have.status(404);
        })
        it('Deve retornar 404 ao enviar um id inválido (fora do formato)', async () => {
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
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: token }).send(recipe);
            expect(resPostRecipe).to.have.status(201);

            const resLoginAdmin = await chai.request(app).post(`/login`).send(loginAdmin);
            expect(resLoginAdmin).to.have.status(200);
            const tokenAdmin = resLoginAdmin.body.token;

            const photoFile = path.resolve(__dirname, '../../uploads/ratinho.jpg');
            const content = fs.createReadStream(photoFile);
            const respUpdateImage = await chai.request(app)
            .put(`/recipes/trybe/image`)
            .attach('image', content)
            .set({ Authorization: tokenAdmin });
            expect(respUpdateImage).to.have.status(404);
        })
        it('Deve retornar 404 ao tentar inserir uma imagem com usuario não autorizado', async () => {
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
            const resLoginAdmin = await chai.request(app).post(`/login`).send(loginAdmin);
            expect(resLoginAdmin).to.have.status(200);
            const tokenAdmin = resLoginAdmin.body.token;

            const resPostRecipe = await chai.request(app).post(`/recipes`).
            set({ Authorization: tokenAdmin }).send(recipe);
            expect(resPostRecipe).to.have.status(201);

            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;

            const photoFile = path.resolve(__dirname, '../../uploads/ratinho.jpg');
            const content = fs.createReadStream(photoFile);
            const respUpdateImage = await chai.request(app)
            .put(`/recipes/${resPostRecipe.body.recipe._id}/image`)
            .attach('image', content)
            .set({ Authorization: token });
            expect(respUpdateImage).to.have.status(401);
        })
    })
    describe('GET /images/<id-da-receita>.jpeg', () => {
        it('Deve retornar status 200 e foto se passar a url corretamente', async () => {
            const login = {
                email: 'erickjacquin@gmail.com', 
                password: '12345678',
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

            const photoFile = path.resolve(__dirname, '../../uploads/ratinho.jpg');
            const content = fs.createReadStream(photoFile);
            const respUpdateImage = await chai.request(app)
            .put(`/recipes/${resPostRecipe.body.recipe._id}/image`)
            .attach('image', content)
            .set({ Authorization: token });
            expect(respUpdateImage).to.have.status(200);

            const resGetPhoto = await chai.request(app)
            .get(`/images/${resPostRecipe.body.recipe._id}.jpeg`)
            expect(resGetPhoto).to.have.status(200);
            expect(resGetPhoto.header).to.haveOwnProperty('content-type').to.be.equal('image/jpeg');

        })
    })
});