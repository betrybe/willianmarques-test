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

    static noContent() {
      return {
        statusCode: 204,
      };
    }
  
    static errorRequest(error) {
      return {
        statusCode: error.statusCode || 500,
        body: {
          message: error.message,
        },
      };
    }
  };