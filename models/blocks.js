const mongoose = require('mongoose');
const SHA256 = require('crypto-js/sha256');

let blockSchema = new mongoose.Schema({
    index: {},
    timestamp: {type: Date, default: Date.now},
    txSummary: {},
    previousHash: String,
    hash: String,
    nonce: {type:Number, default: 0},
    merkleRoot: String,
    difficulty: {type: Number, default: 3},
    lastTx: Date
})

blockSchema.methods.calculateHash = function(){
  return SHA256(this.txSummary + this.nonce + this.timestamp + this.previousHash + this.index).toString();
}
blockSchema.methods.getRoot = function(){
  return SHA256(this.txSummary).toString();
}

blockSchema.methods.getIndex = function(latestBlock){
  return latestBlock[0].index + 1;
}

blockSchema.methods.mine = async function(latestBlock){
//let block = this;
let count = 0;
this.index = await this.getIndex(latestBlock);

  while (this.calculateHash().substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")){
    this.nonce++;
    count++;
    this.hash = this.calculateHash();
  }
  return count;
}

blockSchema.statics.checkValid = async function(){
  let chain = await this.find(function(err, chain){
    if(err){
      console.log(err);
    }else{
      //console.log(chain);
      return chain;
    }
  })

  for(let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    if (currentBlock.merkleRoot !== currentBlock.getRoot()) {
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
  
module.exports = blockSchema;