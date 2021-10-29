const chai = require('chai');
const constsMessages = require('../../../utils/helpers/consts-messages');
const expect = chai.expect;

describe('Consts messages', () => {
    it('As mensagem devem ser iguais as que foram definidas no objeto mensagens', () => {
        mensagens = {
            INVALID_FIELDS: 'All fields must be filled',
            PASS_EMAIL_INCORRECT: 'Incorrect username or password',
            RECIPE_NOTFOUND: 'recipe not found',
            RECIPE_NOT_YOURS: 'the recipe is not yours',
            ONLY_ADMIN_CAN: 'Only admins can register new admins',
        };
        expect(constsMessages.INVALID_FIELDS).to.be.equal(mensagens.INVALID_FIELDS);
        expect(constsMessages.PASS_EMAIL_INCORRECT).to.be.equal(mensagens.PASS_EMAIL_INCORRECT);
        expect(constsMessages.RECIPE_NOTFOUND).to.be.equal(mensagens.RECIPE_NOTFOUND);
        expect(constsMessages.RECIPE_NOT_YOURS).to.be.equal(mensagens.RECIPE_NOT_YOURS);
        expect(constsMessages.ONLY_ADMIN_CAN).to.be.equal(mensagens.ONLY_ADMIN_CAN);
    })
})