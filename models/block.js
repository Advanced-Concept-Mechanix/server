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

let blockSchema = new mongoose.Schema({
  index: Number,
  productId: String,
  timestamp: {type: Date, default: Date.now()},
  transactionSummary: [transactionSchema],
  previousHash: String,
  hash: String,
  nonce: Number,
  difficulty: {type: Number, default: 3},
  validity: Boolean
})

blockSchema.statics.latestDoc = function(){
  return this.find().limit(1).sort({$natural: -1});
}

blockSchema.methods.getIndex = function(latestDoc){
  return latestDoc.index + 1;
}

blockSchema.methods.getPreviousHash = function(latestDoc){
  return latestDoc.hash;
}

blockSchema.statics.checkValidity = function(latestDoc){
  let thisModel = this;

  if (this.hash !== thisModel.calculateHash()) {
    console.log("Current hash is the problem!");
    return false;
  }

  if (this.previousHash !== latestDoc.hash) {
    console.log("Previous hash is the problem!");
    return false;
  }
  return true;
}

blockSchema.methods.calculateHash = function(){
  return SHA256(this.index + this.previousHash + this.timestamp + this.transactionSummary + this.nonce).toString();
}

blockSchema.methods.mine = function(){
  let thisModel = this;
  while (this.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
    this.nonce++;
    this.hash = thisModel.calculateHash();
  }
}
  
module.exports = mongoose.model('Block',blockSchema);