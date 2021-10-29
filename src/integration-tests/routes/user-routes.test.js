const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../api/app');
const mongoHelper = require('../../infra/mongo-helper');
const expect = chai.expect;
chai.use(chaiHttp);

let userModel;

describe('User Routes', () => {
    before(async () => {
        userModel = await mongoHelper.getCollection('users');
    })
    beforeEach(async () => {
        await userModel.deleteMany();
    })

    describe('Post /users', () => {
        it('Deve retornar statusCode 200 ao passar todos os parâmetros do user', () => {
            const user = {
                name: 'erick',
                email: 'erickjaquin@gmail.com',
                password: '12345678',
            }
            chai.request(app).post(`/users`)
                .send(user)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res.body.user).to.haveOwnProperty('name').to.be.equal(user.name);
                    expect(res.body.user).to.haveOwnProperty('email').to.be.equal(user.email);
                });
        })
        it('Deve retornar statusCode 400 ao passar parametro name inválido', () => {
            const user = {
                email: 'erickjaquin@gmail.com',
                password: '12345678',
            }
            chai.request(app).post(`/users`)
                .send(user)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body).to.haveOwnProperty('message').to.be.equal('Invalid entries. Try again.');
                });
        })
        it('Deve retornar statusCode 400 ao passar parametro email inválido (vazio)', () => {
            const user = {
                name: 'erick',
                password: '12345678',
            }
            chai.request(app).post(`/users`)
                .send(user)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body).to.haveOwnProperty('message').to.be.equal('Invalid entries. Try again.');
                });
        })
        it('Deve retornar statusCode 400 ao passar parametro email inválido (formato incorreto)', () => {
            const user = {
                name: 'erick',
                email: 'erick.com',
                password: '12345678',
            }
            chai.request(app).post(`/users`)
                .send(user)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body).to.haveOwnProperty('message').to.be.equal('Invalid entries. Try again.');
                });
        })
        it('Deve retornar statusCode 409 ao cadastrar dois users com o mesmo email', async () => {
            const user = {
                name: 'erick',
                email: 'erickjaquin@gmail.com',
                password: '12345678',
            }
            const postRes = await chai.request(app).post(`/users`).send(user)
            expect(postRes).to.have.status(201);
            const postResAgain = await chai.request(app).post(`/users`).send(user)
            expect(postResAgain).to.have.status(409);
            expect(postResAgain.body).to.haveOwnProperty('message').to.be.equal('Email already registered');
        });
    })
})

describe('User Routes (ADMIN)', () => {
    before(async () => {
        userModel = await mongoHelper.getCollection('users');
    })
    beforeEach(async () => {
        await userModel.deleteMany({});
        const users = [
            { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' },
            { name: 'Erick Jacquin', email: 'erickjacquin@gmail.com', password: '12345678', role: 'user' },
        ];
        await userModel.insertMany(users);
    });
    describe('Post /users/admin', () => {
        it('Deve retornar statusCode 200 ao passar todos os parâmetros do user enviando token de usuário admin', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const user = {
                name: 'willian2',
                email: 'willian2@trybe.com',
                password: '123456'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostAdmin = await chai.request(app).post(`/users/admin`).
            set({ Authorization: token }).send(user);
            expect(resPostAdmin).to.have.status(201);
        })
        it('Deve retornar statusCode 403 ao passar todos os parâmetros do user enviando token de usuário não admin', async () => {
            const login = { 
                email: 'erickjacquin@gmail.com', 
                password: '12345678'
            }
            const user = {
                name: 'willian2',
                email: 'willian2@trybe.com',
                password: '123456'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostAdmin = await chai.request(app).post(`/users/admin`).
            set({ Authorization: token }).send(user);
            expect(resPostAdmin).to.have.status(403);
        })
        it('Deve retornar statusCode 400 ao passar dados inválidos (password)', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const user = {
                name: 'willian2',
                email: 'willian2@trybe.com'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostAdmin = await chai.request(app).post(`/users/admin`).
            set({ Authorization: token }).send(user);
            expect(resPostAdmin).to.have.status(400);
        })
        it('Deve retornar statusCode 400 ao passar dados inválidos (name)', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const user = {
                email: 'willian2@trybe.com',
                password: '123456'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostAdmin = await chai.request(app).post(`/users/admin`).
            set({ Authorization: token }).send(user);
            expect(resPostAdmin).to.have.status(400);
        })
        it('Deve retornar statusCode 400 ao passar dados inválidos (email (vazio))', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const user = {
                name: 'willian',
                password: '123456'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostAdmin = await chai.request(app).post(`/users/admin`).
            set({ Authorization: token }).send(user);
            expect(resPostAdmin).to.have.status(400);
        })
        it('Deve retornar statusCode 400 ao passar dados inválidos (email (fora do formato))', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const user = {
                name: 'willian',
                email: 'williantrybe.com',
                password: '123456'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostAdmin = await chai.request(app).post(`/users/admin`).
            set({ Authorization: token }).send(user);
            expect(resPostAdmin).to.have.status(400);
        })
        it('Deve retornar statusCode 401 ao passar um token inválido (sem token)', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const user = {
                name: 'willian',
                email: 'williantrybe.com',
                password: '123456'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostAdmin = await chai.request(app).post(`/users/admin`).
            set({ Authorization: '' }).send(user);
            expect(resPostAdmin).to.have.status(401);
            expect(resPostAdmin.body.message).to.be.equal('missing auth token');
        })
        it('Deve retornar statusCode 401 ao passar um token inválido (token fora do padrão)', async () => {
            const login = { 
                email: 'root@email.com', 
                password: 'admin'
            }
            const user = {
                name: 'willian',
                email: 'williantrybe.com',
                password: '123456'
            }
            const resLogin = await chai.request(app).post(`/login`).send(login);
            expect(resLogin).to.have.status(200);
            const token = resLogin.body.token;
            const resPostAdmin = await chai.request(app).post(`/users/admin`).
            set({ Authorization: 'dasdasdlasdjklas' }).send(user);
            expect(resPostAdmin).to.have.status(401);
            expect(resPostAdmin.body.message).to.be.equal('jwt malformed');
        })
    })
})



