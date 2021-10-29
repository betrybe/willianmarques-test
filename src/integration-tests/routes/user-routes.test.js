const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../api/app');
const mongoHelper = require('../../infra/mongo-helper');
const expect = chai.expect;
chai.use(chaiHttp);

let userModel;
const url = 'http://localhost:3000';

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
            chai.request(app).post(`/users`)
            .send(user)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);

                chai.request(app).post(`/users`)
                .send(user)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(409);
                    expect(res.body).to.haveOwnProperty('message').to.be.equal('Email already registered');
                });
            });
        })
    })
})