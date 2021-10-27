const InvalidParamsError = require('../errors/invalid-params-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const UserAlreadyExistsError = require('../errors/user-already-exists-error');

module.exports = class HttpResponse {
    static ok(body) {
      return {
        statusCode: 200,
        body,
      };
    }

    static created(body) {
      return {
        statusCode: 201,
        body,
      };
    }
  
    static errorRequest(error) {
      let statusCode = 0;
      switch (error.constructor) {
        case UserAlreadyExistsError:
          statusCode = 409;
          break;
        case InvalidParamsError:
          statusCode = 400;
          break;
        default:
          statusCode = 500;
          break;
      }
      return {
        statusCode,
        body: {
          message: error.message,
        },
      };
    }
  
    static unauthorizedError() {
      return {
        statusCode: 401,
        body: {
          message: new UnauthorizedError().message,
        },
      };
    }
  };