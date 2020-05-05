"use strict";

const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

module.exports = class Decrypt{
    constructor(message, signature, pubKey){
        this.message = message;
        this.signature = signature;
        this.publicKey = pubKey;
        this.verifySign = this.verifySignature();
        this.verifiedMessage = this.openMessage();
    }

    verifySignature(msg = this.message, sig = this.signature, pubKey = this.publicKey){

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

    openMessage(signedMsg = this.signedMessage, pubKey = pubKey = this.publicKey){

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
