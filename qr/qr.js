"use strict";

const QRCode = require('qrcode')
const QrCodeReader = require('qrcode-reader');
const Jimp = require("jimp");
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');
 
class encryptData{
    constructor(data){
        this.data = data;
        this.keys = this.getKeys();
        this.signedMessage = this.signMessage();
        this.finalFile = this.getFinalFile();
    }

    getKeys(){
        return nacl.sign.keyPair();
    }

    signMessage(dt = this.data, sKey = this.keys.secretKey){

        if (!(sKey instanceof Uint8Array)) {
            sKey = nacl.util.decodeBase64(sKey.toString());
        }
        if (!(dt instanceof Uint8Array)) {
            dt = nacl.util.decodeUTF8(dt.toString());
        }

        let signedMessage = nacl.sign(dt, sKey);
        return nacl.util.encodeBase64(signedMessage);
    }

    getFinalFile(dt = this.signedMessage, pubKey = this.keys.publicKey){

        if (!(pubKey instanceof Uint8Array)) {
            pubKey = nacl.util.decodeBase64(pubKey.toString());
        }
        if (!(dt instanceof Uint8Array)) {
            dt = nacl.util.decodeUTF8(dt.toString());
        }

        return [pubKey, dt];

    }

}

async function generateQR(data){

    let promise = new Promise((resolve, reject) => {
        resolve(
            new encryptData(data)
        )
    });

    let result = await promise;

    return QRCode.toFile(
        "qrcodesample3.png",
        result.finalFile
    )
}

class decodeQR{
    constructor(image){
        this.image = image;
        this.data = this.getData();
        this.message = this.openMessage();
    }

    getData(img = this.image){

        let buffer = fs.readFileSync(__dirname + img);

        Jimp.read(buffer, function(err, image) {
            if (err) {
                console.error(err);
                // TODO handle error
            }
            let qr = new QrCodeReader();
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

    }

    openMessage(signedMsg = this.data.dt, pubKey = this.data.pubKey){

        if (!(signedMsg instanceof Uint8Array)) {
            signedMsg = nacl.util.decodeBase64(signedMsg.toString());
        }
        if (!(pubKey instanceof Uint8Array)) {
            pubKey = nacl.util.decodeBase64(pubKey.toString());
        }

        let verifiedMessage = nacl.sign.open(signedMsg, pubKey);
        return String.fromCharCode.apply(null, verifiedMessage);
    }
}

console.log(generateQR("another qr"));

//let sampleQR = new createQR("a qr trial");
//console.log(JSON.stringify(sampleQR, null, 4));

//console.log(sampleQR.finalFile);

//let sampleQRDecoded = new decodeQR("./qrcodesample2");
//console.log(JSON.stringify(sampleQRDecoded, null, 4));
