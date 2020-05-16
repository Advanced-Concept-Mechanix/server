const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//const PubKey = require('../blockchain/pubKey');
const pubKey = require('../blockchain/pubKey');
//const SecretKey = require('../blockchain/secretKey');
const secretKey = require('../blockchain/secretKey');

let userSchema = new mongoose.Schema({
    name: {type:String, unique: true},
    password: String,
    email: {type:String, unique: true, uniqueCaseInsensitive: true},
    phone: Number,
    company: String,
    type: {type:String, enum: ["manufacturer", "distributor", "retailer", "end-user"]},
    publicKey: {},
    secretKey: {}
  })

userSchema.methods.getPublicKey = function(){
    return pubKey();
}

userSchema.methods.getSecretKey = function(){
    return secretKey();
}

userSchema.plugin(uniqueValidator, { message: 'Sorry, there is already a user with the {PATH}: {VALUE}. Please try again' });
  
module.exports = userSchema;