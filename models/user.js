const mongoose = require('mongoose');
//const PubKey = require('../blockchain/pubKey');
const pubKey = require('../blockchain/pubKey');
//const SecretKey = require('../blockchain/secretKey');
const secretKey = require('../blockchain/secretKey');

let userSchema = new mongoose.Schema({
    name: {type:String, unique: true},
    password: String,
    email: {type:String, unique: true},
    phone: Number,
    company: String,
    type: String,
    publicKey: {},
    secretKey: {}
  })

userSchema.methods.getPublicKey = function(){
    return pubKey();
}

userSchema.methods.getSecretKey = function(){
    return secretKey();
}
  
module.exports = userSchema;