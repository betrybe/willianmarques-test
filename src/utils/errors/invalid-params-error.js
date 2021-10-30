module.exports = class InvalidParamsError extends Error {
    constructor() {
      super('Invalid entries. Try again.');
      this.statusCode = 400;
      this.name = 'InvalidParams Error';
    }
};