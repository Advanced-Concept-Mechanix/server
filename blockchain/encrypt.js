"use strict";

const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

module.exports = class Encrypt{
    constructor(message, sKey){
        this.message = message;
        this.secretKey = sKey;
        this.signedMessage = this.signMessage();
        this.signature = this.getSignature(); 
        this.timestamp = Date.now();
    }

    signMessage(msg = this.message, sKey = this.secretKey){

        if (!(sKey instanceof Uint8Array)) {
            sKey = nacl.util.decodeBase64(sKey.toString());
        }
        if (!(msg instanceof Uint8Array)) {
            msg = nacl.util.decodeUTF8(msg.toString());
        }

        let signedMessage = nacl.sign(msg, sKey);
        return nacl.util.encodeBase64(signedMessage);
    }

    getSignature(msg = this.message, sKey = this.secretKey){

        if (!(sKey instanceof Uint8Array)) {
            sKey = nacl.util.decodeBase64(sKey.toString());
        }
        if (!(msg instanceof Uint8Array)) {
            msg = nacl.util.decodeUTF8(msg.toString());
        }

        let signature = nacl.sign.detached(msg, sKey);
        //console.log("signature length: " + signature.byteLength)
        return nacl.util.encodeBase64(signature);
    }
}


//let message1 = new Encrypt("A new test!!");

//console.log(JSON.stringify(message1, null, 4));