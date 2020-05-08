const mongoose = require('mongoose');

let blockSchema = new mongoose.Schema({
  index: Number,
  productId: String,
  timestamp: {type: Date, default: Date.now()},
  transactionSummary: Array,
  previousHash: String,
  hash: String,
  nonce: Number,
  difficulty: {type: Number, default: 3},
  validity: Boolean,
})

module.exports = blockSchema;