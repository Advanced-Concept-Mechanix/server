const Block = require('./block');
// const {block1} = require('./block');
// const {block2} = require('./block');

module.exports = class Blockchain{
    constructor() {
        this.chain = [this.createGenesis()];
        this.difficulty = 3;
        this.validity = this.checkValid();
    }

    createGenesis() {
        return new Block(0, Date.now(), "Genesis block", "0")
    }

    latestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        //incrementing the index
        let previousBlockIndex = this.latestBlock().index;
        newBlock.index = previousBlockIndex + 1;

        newBlock.previousHash = this.latestBlock().hash;
        newBlock.hash = newBlock.calculateHash();

        let timeBeforeMining = Date.now();
        newBlock.mineBlock(this.difficulty);
        let timeAfterMining = Date.now();
        let timeToMine = timeAfterMining - timeBeforeMining;
        console.log("Time to mine: " + timeToMine + " milliseconds");
        
        //newBlock.index = this.chain.length;
        this.chain.push(newBlock);
        //const currentChain = [...this.chain, newBlock];
        //return currentChain;
    }

    checkValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log("Current hash is the problem!");
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log("Previous hash is the problem!");
                return false;
            }
        }

        return true;
    }
}

// let sampleChain = new Blockchain;

// console.log("Mining block 1...");
// sampleChain.addBlock(block1);
// console.log("Mining block 2...");
// sampleChain.addBlock(block2);

// console.log(JSON.stringify(sampleChain, null, 4));
// console.log("Is blockchain valid? " + sampleChain.checkValid());