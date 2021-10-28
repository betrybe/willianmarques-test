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
  
    static errorRequest(error) {
      return {
        statusCode: error.statusCode,
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