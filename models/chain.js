const mongoose = require('mongoose');
const SHA256 = require('crypto-js/sha256');

let transactionSchema = new mongoose.Schema({
  user: String,
  location: String,
  createdAt: {type: Date, default: new Date()}
})

// let blockSchema = new mongoose.Schema({
//   transactions: [transactionSchema]
// })

let chainSchema = new mongoose.Schema({
  index: Number,
  timestamp: {type: Date, default: Date.now()},
  transactionSummary: [transactionSchema],
  previousHash: String,
  hash: String,
  nonce: Number,
  difficulty: Number,
  validity: Boolean
})

chainSchema.statics.latestDoc = function(){
  return this.find().limit(1).sort({$natural: -1});
}

chainSchema.statics.checkValidity = function(){
  const latestDocument = latestDoc();

  if (this.hash !== this.calculateHash()) {
    console.log("Current hash is the problem!");
    return false;
  }

  if (this.previousHash !== latestDocument.hash) {
    console.log("Previous hash is the problem!");
    return false;
  }
  return true;
}

chainSchema.methods.calculateHash = function(){
  return SHA256(this.index + this.previousHash + this.timestamp + this.transactionSummary + this.nonce).toString();
}

chainSchema.methods.mine = function(){
  while (this.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
    this.nonce++;
    this.hash = this.calculateHash();
  }
}
  
module.exports = mongoose.model('Blockchain',chainSchema);