module.exports = class ServerError extends Error {
    constructor() {
      super('Internal error');
      this.statusCode = 500;
      this.name = 'Server Error';
    }
};