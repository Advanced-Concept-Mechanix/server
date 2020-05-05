"use strict";

const SHA256 = require('crypto-js/sha256');

module.exports = class Uuid{
    constructor(data, sKey){
        this.data = data;
        this.secretKey = sKey;
        this.UUID = this.getUUID();
    }

    getUUID(sKey = this.secretKey){
        return SHA256(sKey + this.timestamp + this.message).toString();
    }
}


//let message1 = new Encrypt("A new test!!");

//console.log(JSON.stringify(message1, null, 4));