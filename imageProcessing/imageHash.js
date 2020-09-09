const imghash = require('imghash');
const compare = require('hamming-distance');

const hashImage = (img) => {
    return imghash.hash(img, 64);
}

const compareImages = (img1, img2) => {
    const hash1 = hashImage(img1);
    const hash2 = hashImage(img2);
    let status = false;

    Promise
    .all([hash1, hash2])
    .then((results) => {
        const dist = compare(results[0], results[1]);
        console.log(`Distance between images is: ${dist}`);
        if (dist <= 12) {
        console.log('Images are similar');
        status = true;
        } else {
        console.log('Images are NOT similar');
        }
    });
    return status;
}

// Example
// console.log(compareImages('./images/north_korea.jpg', '../blockchain/north_korea_1.jpg'))

module.exports = compareImages;