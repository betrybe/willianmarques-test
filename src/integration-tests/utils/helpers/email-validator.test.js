const emailValidator = require('../../../utils/helpers/email-validator');
const chai = require('chai');
const expect = chai.expect;

describe('emailValidator()', () => {
    it('Deve retornar falso quando passar um email inválido', () => {
        const email = 'teste.com';
        expect(emailValidator.isValid(email)).to.be.equal(false);
    })
    it('Deve retornar verdadeiro quando passar um email válido', () => {
        const email = 'teste@teste.com';
        expect(emailValidator.isValid(email)).to.be.equal(true);
    })
    it('Deve retornar falso quando passar um email vazio', () => {
        const email = '';
        expect(emailValidator.isValid(email)).to.be.equal(false);
    })
});
