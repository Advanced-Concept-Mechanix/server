const mongoose = require('mongoose');
const SHA256 = require('crypto-js/sha256');

let transactionSchema = new mongoose.Schema({
    userId: String,
    location: String,
    createdAt: {type: Date, default: Date.now()},
    hash: String
})

transactionSchema.methods.calculateHash = function(tx){
    return SHA256(tx);
}

module.exports = transactionSchema;