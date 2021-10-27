module.exports = class EmailValidator {
    static isValid(email) {
        if (!email) {
            return false;
        }
        const regex = /\S+@\S+\.\S+/;
        return regex.test(String(email).toLowerCase());
    }
};