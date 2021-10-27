module.exports = class InvalidParamsError extends Error {
    constructor() {
      super('Invalid entries. Try again.');
      this.name = 'InvalidParams Error';
    }
};