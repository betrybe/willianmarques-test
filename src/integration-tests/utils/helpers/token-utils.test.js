const chai = require('chai');
const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/auth-config');
const { generateToken, decodeToken } = require('../../../utils/helpers/token-utils');
const expect = chai.expect;

describe('tokenUtils', () => {
    describe('generateToken()', () => {
        it('Ao passar um usuário deve retornar um token válido', () => {
            const user = {
                name: 'willian',
                email: 'willian@trybe.com'
            }
            const token = jwt.sign({ user }, authConfig.secret, authConfig.JWTConfig);
            expect(generateToken(user)).to.be.equal(token);
        })
    })
    describe('decodeToken()', () => {
        it('Ao passar um token deve retornar o token decodificado com a mesma informação do usuário', () => {
            const user = {
                name: 'willian',
                email: 'willian@trybe.com'
            }
            const token = jwt.sign({ user }, authConfig.secret, authConfig.JWTConfig);
            const tokenDecoded = jwt.decode(token);
            expect(decodeToken(token).user.name).to.be.equal(tokenDecoded.user.name);
            expect(decodeToken(token).user.email).to.be.equal(tokenDecoded.user.email);
        })
    })
});