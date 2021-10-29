module.exports = function getImagePath(imageName, extensionImage) {
    return `localhost:3000/src/uploads/${imageName}.${extensionImage}`;
};