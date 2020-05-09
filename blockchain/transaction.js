const SHA256 = require('crypto-js/sha256');

module.exports = class Transaction{
    constructor(user, product, location){
        this.user = user;
        this.product = product;
        this.location = location;
        this.createdAt = new Date();
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.user + this.product + this.location + this.createdAt).toString();
    }
}

//let tx1 = new Transact("my first transaction");

//console.log(JSON.stringify(tx1, null, 4));