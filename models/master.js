const mongoose = require('mongoose');

let keySchema = new mongoose.Schema({
    publicKey: String,
    privateKey: String
})
  
module.exports = keySchema;