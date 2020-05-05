const mongoose = require('mongoose');

let chainSchema = new mongoose.Schema({
    index: Number,
    timestamp: Number,
    transactionSummary: Array,
    previousHash: String,
    hash: String,
    nonce: Number,
    difficulty: Number,
    validity: Boolean
  })
  
module.exports = mongoose.model('Blockchain',chainSchema);