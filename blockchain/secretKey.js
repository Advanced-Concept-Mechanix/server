const nacl = require('tweetnacl');

/*const pubKey = (data) => {
    return new Encrypt(data).getKeys().publicKey;
}*/

module.exports = class SecretKey{
    constructor(){
        this.secretKey = this.getSecretKey();
    }

    getSecretKey(){
        return nacl.sign.keyPair().secretKey;
    }
}

//let secretKey1 = new SecretKey();

//console.log(JSON.stringify(SecretKey1, null, 4));

