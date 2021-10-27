const ServerError = require('../errors/server-error');
const UnauthorizedError = require('../errors/unauthorized-error');

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
  
    static badRequest(error) {
      return {
        statusCode: 400,
        body: {
          error: error.message,
        },
      };
    }
  
    static unauthorizedError() {
      return {
        statusCode: 401,
        body: {
          error: new UnauthorizedError().message,
        },
      };
    }
  
    static serverError() {
      return {
        statusCode: 500,
        body: {
          error: new ServerError().message,
        },
      };
    }
  };