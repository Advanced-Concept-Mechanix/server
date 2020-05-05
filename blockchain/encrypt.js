"use strict";

const SHA256 = require('crypto-js/sha256');

const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

module.exports = class Encrypt{
    constructor(message){
        this.message = message;
        this.keys = this.getKeys();
        this.UUID = this.getUUID();
        this.signedMessage = this.signMessage();
        this.signature = this.getSignature(); 
        this.verifySign = this.verifySignature();
        this.verifiedMessage = this.openMessage();
        this.timestamp = Date.now();
    }

    getKeys(){
        //let keys = nacl.sign.keyPair();
        //return nacl.util.encodeBase64(keys);
        return nacl.sign.keyPair();
    }

    getUUID(sKey = this.keys.secretKey){
        return SHA256(sKey + this.timestamp + this.message).toString();
    }

    signMessage(msg = this.message, sKey = this.keys.secretKey){

        if (!(sKey instanceof Uint8Array)) {
            sKey = nacl.util.decodeBase64(sKey.toString());
        }
        if (!(msg instanceof Uint8Array)) {
            msg = nacl.util.decodeUTF8(msg.toString());
        }

        let signedMessage = nacl.sign(msg, sKey);
        return nacl.util.encodeBase64(signedMessage);
    }

    getSignature(msg = this.message, sKey = this.keys.secretKey){

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

    verifySignature(msg = this.message, sig = this.signature, pubKey = this.keys.publicKey){

        if (!(msg instanceof Uint8Array)) {
            msg = nacl.util.decodeUTF8(msg.toString());
        }
        if (!(sig instanceof Uint8Array)) {
            sig = nacl.util.decodeBase64(sig.toString());
        }
        if (!(pubKey instanceof Uint8Array)) {
            pubKey = nacl.util.decodeBase64(pubKey.toString());
        }

        return nacl.sign.detached.verify(msg, sig, pubKey);
    }

    openMessage(signedMsg = this.signedMessage, pubKey = this.keys.publicKey){

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


//let message1 = new Encrypt("A new test!!");

//console.log(JSON.stringify(message1, null, 4));