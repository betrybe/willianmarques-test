const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../api/app');
const mongoHelper = require('../../infra/mongo-helper');
const expect = chai.expect;
chai.use(chaiHttp);

let userModel;

describe('Login Routes', () => {
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
    it('Deve retornar 200 se passar o usuario e senha corretamente', async () => {
        const login = {
            email: 'root@email.com', 
            password: 'admin',
        }
        const res = await chai.request(app).post(`/login`).send(login);
        expect(res).to.have.status(200);
    })
    it('Deve retornar 401 se passar email inválido', async () => {
        const login = {
            email: '', 
            password: 'admin',
        }
        const res = await chai.request(app).post(`/login`).send(login);
        expect(res).to.have.status(401);
        expect(res.body.message).to.be.equal('All fields must be filled');
    })
    it('Deve retornar 401 se passar senha inválida', async () => {
        const login = {
            email: 'root@email.com', 
            password: '',
        }
        const res = await chai.request(app).post(`/login`).send(login);
        expect(res).to.have.status(401);
        expect(res.body.message).to.be.equal('All fields must be filled');
    })
    it('Deve retornar 401 se passar email inválido (fora do formato)', async () => {
        const login = {
            email: 'rootemail.com', 
            password: 'admin',
        }
        const res = await chai.request(app).post(`/login`).send(login);
        expect(res).to.have.status(401);
        expect(res.body.message).to.be.equal('Incorrect username or password');
    })
});