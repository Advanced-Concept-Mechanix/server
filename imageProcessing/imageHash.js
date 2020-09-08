const { imageHash }= require('image-hash');
const compare = require('hamming-distance');

// remote file simple
// imageHash('https://ichef-1.bbci.co.uk/news/660/cpsprodpb/7F76/production/_95703623_mediaitem95703620.jpg', 16, true, (error, data) => {
//   if (error) throw error;
//   console.log(data);
//   // 0773063f063f36070e070a070f378e7f1f000fff0fff020103f00ffb0f810ff0
// });

const hashImg = (url) => {
    let pHash = imageHash(url, 64, true, (error, data) => {
        if(error){
            console.log(`Error: ${error}`)
            throw error;
        }
        // let hashStr = bin2String(pHash);
        console.log(`hash: ${data}, length:${data.length}, type:${data.type}, char:${data[6]}`);
        return data;
    })
    return pHash;
}

// hashImg('./images/north_korea_1.jpg');
let phash1 = hashImg('./images/north_korea.jpg');
let phash2 = hashImg('./images/north_korea_2.jpg')
// let distance = compare(phash1, phash2);
console.log(phash1, phash2)
// console.log(bin2String(phash1));
// var distance = compare(Buffer.from(phash1, 'hex'), Buffer.from(phash2, 'hex'));
// console.log(`distance: ${distance}`);