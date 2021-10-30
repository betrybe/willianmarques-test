const getImagePath = require('../../../utils/helpers/get-image-path');
const chai = require('chai');
const expect = chai.expect;

describe('getImagePath()', () => {
    it('Deve retornar um caminho de imagem válido', () => {
        const imageName = 'betrybe.jpg';
        expect(getImagePath(imageName)).to.be.equal('localhost:3000/src/uploads/betrybe.jpg');
    })
});
