const mongoose = require('mongoose');
const PubKey = require('../blockchain/pubKey');
const SecretKey = require('../blockchain/secretKey');

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    company: String,
    type: String,
    publicKey: String,
    secretKey: String
  })

userSchema.methods.getPublicKey = function(){
    return new PubKey();
}

userSchema.methods.getSecretKey = function(){
    return new SecretKey();
}
  
module.exports = mongoose.model('User', userSchema)