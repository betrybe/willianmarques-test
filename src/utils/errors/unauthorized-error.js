module.exports = class UnauthorizedError extends Error {
    constructor() {
      super('missing auth token');
      this.name = 'Unauthorized Error';
    }
};