const mongoose = require('mongoose');
const SHA256 = require('crypto-js/sha256');

let blockSchema = new mongoose.Schema({
  index: Number,
  productId: String,
  timestamp: {type: Date, default: Date.now()},
  transactionSummary: Array,
  previousHash: String,
  hash: String,
  nonce: {type: Number, default: 0},
  difficulty: {type: Number, default: 3},
  validity: Boolean,
});

blockSchema.methods.calculateHash = function(tx){
  return SHA256(tx);
}

module.exports = blockSchema;