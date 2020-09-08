const { imageHash }= require('image-hash');
const imghash = require('imghash');
const compare = require('hamming-distance');

const hash1 = imghash.hash('./images/north_korea.jpg');
const hash2 = imghash.hash('./images/north_korea.jpg');

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