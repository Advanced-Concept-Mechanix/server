const SHA256 = require('crypto-js/sha256');


module.exports = class P2sh{
    constructor(pubKey){
        this.publicKey = pubKey;
        this.p2sh = this.getP2sh().toString();
    }

    getP2sh(){
        return SHA256(this.publicKey); 
    }
}

//let P2sh1 = new P2sh();

//console.log(JSON.stringify(P2sh1, null, 4));