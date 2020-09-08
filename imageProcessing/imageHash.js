const imghash = require('imghash');
const compare = require('hamming-distance');

const hashImage = (img) => {
    return imghash.hash(img, 64);
}

const hash1 = hashImage('./images/north_korea.jpg');
const hash2 = hashImage('./images/north_korea_2.jpg');

Promise
  .all([hash1, hash2])
  .then((results) => {
    const dist = compare(results[0], results[1]);
    console.log(`Distance between images is: ${dist}`);
    if (dist <= 12) {
      console.log('Images are similar');
    } else {
      console.log('Images are NOT similar');
    }
});