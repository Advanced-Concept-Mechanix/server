const imghash = require('imghash');
const compare = require('hamming-distance');

const hashImage = (img) => {
    return imghash.hash(img, 64);
}

const compareImages = async(img1, img2) => {
    const hash1 = await hashImage(img1);
    const hash2 = await hashImage(img2);

    const distance = compare(hash1, hash2);
    console.log(`Distance between images is: ${distance}`);
    if(distance <= 12){
        console.log('Images are similar');
        return true;
    }else{
        console.log('Images are NOT similar');
        return false;
    }

    // Promise
    // .all([hash1, hash2])
    // .then((results) => {
    //     const dist = compare(results[0], results[1]);
    //     console.log(`Distance between images is: ${dist}`);
    //     if (dist <= 12) {
    //     console.log('Images are similar');
    //     return Promise.resolve(true);
    //     } else {
    //     console.log('Images are NOT similar');
    //     return Promise.resolve(false);
    //     }
    // });
}

// Example
// compareImages('./images/north_korea.jpg', './images/north_korea.jpg')
// .then((result) => {
//     console.log(result);
// })

module.exports = compareImages;