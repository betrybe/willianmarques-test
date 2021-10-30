const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../api/app');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Get /', () => {
    it('Deve retornar algo', async () =>{
        const res = await chai.request(app).get(`/`);
        expect(res).to.haveOwnProperty('body');
        expect(res).to.have.status(200);
    })
})