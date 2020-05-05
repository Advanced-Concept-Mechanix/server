const nacl = require('tweetnacl');

/*const pubKey = (data) => {
    return new Encrypt(data).getKeys().publicKey;
}*/

class PubKey{
    constructor(){
        this.publicKey = this.getPublicKey();
    }

    getPublicKey(){
        return nacl.sign.keyPair().publicKey;
    }
}

//mypubkey is created for demo purposes

let myPubKey = new PubKey();

module.exports = {
    PubKey: PubKey,
    myPubKey: myPubKey
};

//let pubKey1 = new pubKey();

//console.log(JSON.stringify(pubKey1, null, 4));

//console.log(pubKey1);