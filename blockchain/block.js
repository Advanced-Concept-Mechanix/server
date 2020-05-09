const SHA256 = require('crypto-js/sha256');
const Transaction = require('./transaction');

module.exports = class Block {
    constructor(txSummary){
        this.index = 0;
        this.timestamp = Date.now();
        this.txSummary = txSummary;
        this.previousHash = "0";
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + this.txSummary + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
          }
            
          console.log("BLOCK MINED: " + this.hash);
    }
}

// let block1 = new Block;

// block1.addTx(new Transaction("product1"));
// block1.addTx(new Transaction("product2"));
// block1.addTx(new Transaction("product3"));

// let block2 = new Block;

// block2.addTx(new Transaction("product4"));
// block2.addTx(new Transaction("product5"));
// block2.addTx(new Transaction("product6"));

// module.exports = {
//     Block: Block,
//     block1: block1,
//     block2: block2
// }

//console.log(JSON.stringify(block1, null, 4));