const QrCode = require('qrcode-reader');
const Jimp = require("jimp");
const fs = require('fs');

var buffer = fs.readFileSync(__dirname + '/qrcodesample3.png');
Jimp.read(buffer, function(err, image) {
    if (err) {
        console.error(err);
        // TODO handle error
    }
    var qr = new QrCode();
    qr.callback = function(err, value) {
        if (err) {
            console.error(err);
            // TODO handle error
        }
        console.log(value.result);
        console.log(value);
    };
    qr.decode(image.bitmap);
});