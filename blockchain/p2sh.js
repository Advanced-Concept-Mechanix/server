const SHA256 = require('crypto-js/sha256');
const {PubKey} = require('./pubKey');
const {myPubKey} = require('./pubKey');


module.exports = class P2sh{
    constructor(){
        this.p2sh = this.getP2sh().toString();
    }

    getP2sh(){
        return SHA256(new PubKey(myPubKey)); //for demo purposes
    }
}

//let P2sh1 = new P2sh();

//console.log(JSON.stringify(P2sh1, null, 4));