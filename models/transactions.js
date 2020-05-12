const mongoose = require('mongoose');
const SHA256 = require('crypto-js/sha256');

let transactionSchema = new mongoose.Schema({
    user: String,
    product: String,
    location: String,
    createdAt: {type: Date, default: Date.now},
    hash: String
})

transactionSchema.methods.calculateHash = function(){
    return SHA256(this.user + this.product + this.location + this.createdAt).toString();
}
  
module.exports = transactionSchema;