const chai = require('chai');
const HttpResponse = require('../../../utils/helpers/http-response');
const InvalidParamsError = require('../../../utils/errors/invalid-params-error');
const ForbiddenError = require('../../../utils/errors/forbidden-error');
const NotFoundError = require('../../../utils/errors/not-found-error');
const UnauthorizedError = require('../../../utils/errors/unauthorized-error');
const UserAlreadyExistsError = require('../../../utils/errors/user-already-exists-error');
const expect = chai.expect;

describe('HTTP RESPONSE', () => {
    describe('ok()', () => {
        it('Deve retornar o body que for passado e statuscode 200 ok', () => {
            const body = {
                user: {
                    name: 'willian',
                    email: 'willian@trybe.com',
                },
            }
            expect(HttpResponse.ok(body)).to.haveOwnProperty('body').to.equal(body);
            expect(HttpResponse.ok(body)).to.haveOwnProperty('statusCode').to.equal(200);
        })
    })
    describe('created()', () => {
        it('Deve retornar o body que for passado e statuscode 201 created', () => {
            const body = {
                user: {
                    name: 'willian',
                    email: 'willian@trybe.com',
                },
            }
            expect(HttpResponse.created(body)).to.haveOwnProperty('body').to.equal(body);
            expect(HttpResponse.created(body)).to.haveOwnProperty('statusCode').to.equal(201);
        })
    })
    describe('noContent()', () => {
        it('Deve retornar statuscode 204 nocontent', () => {
            expect(HttpResponse.noContent()).to.haveOwnProperty('statusCode').to.equal(204);
        })
    })
    describe('errorRequest()', () => {
        it('Deve retornar erro 500 caso não seja passado nenhum statuscode', () => {
            expect(HttpResponse.errorRequest(new Error('error'))).to.haveOwnProperty('statusCode').to.equal(500);
        })
        it('Deve retornar um objeto com o body e status code do erro que foi passado como parâmetro (InvalidParamsError)', () => {
            const invalidParamsError = new InvalidParamsError();
            expect(HttpResponse.errorRequest(invalidParamsError)).to.haveOwnProperty('statusCode').to.equal(invalidParamsError.statusCode);
            expect(HttpResponse.errorRequest(invalidParamsError)).to.haveOwnProperty('body').to.haveOwnProperty('message').to.equal(invalidParamsError.message);
        })
        it('Deve retornar um objeto com o body e status code do erro que foi passado como parâmetro (ForbiddenError)', () => {
            const forbiddenError = new ForbiddenError('erro');
            expect(HttpResponse.errorRequest(forbiddenError)).to.haveOwnProperty('statusCode').to.equal(forbiddenError.statusCode);
            expect(HttpResponse.errorRequest(forbiddenError)).to.haveOwnProperty('body').to.haveOwnProperty('message').to.equal(forbiddenError.message);
        })
        it('Deve retornar um objeto com o body e status code do erro que foi passado como parâmetro (NotFoundError)', () => {
            const notFoundError = new NotFoundError('erro');
            expect(HttpResponse.errorRequest(notFoundError)).to.haveOwnProperty('statusCode').to.equal(notFoundError.statusCode);
            expect(HttpResponse.errorRequest(notFoundError)).to.haveOwnProperty('body').to.haveOwnProperty('message').to.equal(notFoundError.message);
        })
        it('Deve retornar um objeto com o body e status code do erro que foi passado como parâmetro (unauthorizedError)', () => {
            const unauthorizedError = new UnauthorizedError('erro');
            expect(HttpResponse.errorRequest(unauthorizedError)).to.haveOwnProperty('statusCode').to.equal(unauthorizedError.statusCode);
            expect(HttpResponse.errorRequest(unauthorizedError)).to.haveOwnProperty('body').to.haveOwnProperty('message').to.equal(unauthorizedError.message);
        })
        it('Deve retornar um objeto com o body e status code do erro que foi passado como parâmetro (userAlreadyExistsError)', () => {
            const userAlreadyExistsError = new UserAlreadyExistsError();
            expect(HttpResponse.errorRequest(userAlreadyExistsError)).to.haveOwnProperty('statusCode').to.equal(userAlreadyExistsError.statusCode);
            expect(HttpResponse.errorRequest(userAlreadyExistsError)).to.haveOwnProperty('body').to.haveOwnProperty('message').to.equal(userAlreadyExistsError.message);
        })
    })
})