const mongoose = require('mongoose');

let transactionStorageSchema = new mongoose.Schema({
    user: String,
    product: String,
    location: String,
    createdAt: Date,
    hash: String
}, { _id: false });
  
module.exports = transactionStorageSchema;