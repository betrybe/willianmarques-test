module.exports = class UserAlreadyExistsError extends Error {
    constructor() {
      super('Email already registered');
      this.statusCode = 409;
      this.name = 'UserAlreadyExistsError Error';
    }
};