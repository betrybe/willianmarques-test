const chai = require('chai');
const { generateToken } = require('../../../utils/helpers/token-utils');
const validateUserToRecipe = require('../../../utils/helpers/validate-user-to-recipe');
const expect = chai.expect;

describe('validateUserToRecipe()', () => {
    it('Deve retornar verdadeiro se o userid for igual ao userid que está no token', () => {
        const user = {
            userId: 'meuid',
            role: 'user',
        }
        const token = generateToken(user);
        const recipeUserId = 'meuid';
        expect(validateUserToRecipe(token, recipeUserId)).to.be.equal(true);
    })
    it('Deve retornar verdadeiro se o role do usuário for admin mesmo não sendo o usuário da recipe', () => {
        const user = {
            userId: 'meuid',
            role: 'admin',
        }
        const token = generateToken(user);
        const recipeUserId = 'diferente';
        expect(validateUserToRecipe(token, recipeUserId)).to.be.equal(true);
    })
    it('Deve retornar falso se o role do usuário não for admin e o usuário não ser o usuário da recipe', () => {
        const user = {
            userId: 'meuid',
            role: 'user',
        }
        const token = generateToken(user);
        const recipeUserId = 'diferente';
        expect(validateUserToRecipe(token, recipeUserId)).to.be.equal(false);
    })
});
