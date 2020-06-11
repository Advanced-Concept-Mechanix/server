const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');
//const PubKey = require('../blockchain/pubKey');
const pubKey = require('../blockchain/pubKey');
//const SecretKey = require('../blockchain/secretKey');
const secretKey = require('../blockchain/secretKey');

var validateEmail = function(email) {
    var re = /\S+@\S+\.\S+/;
    //var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

let userSchema = new mongoose.Schema({
    name: {type:String, unique: true},
    password: String,
    email: {type:String, unique: true, validate: [validateEmail, "Please enter a valid email address"]},
    phone: Number,
    company: String,
    type: {type:String, enum: ["manufacturer", "distributor", "retailer", "end-user"]},
    publicKey: {},
    secretKey: {},
    question: String,
    answer: String
  })

userSchema.methods.getPublicKey = function(){
    return pubKey();
}

userSchema.methods.getSecretKey = function(){
    return secretKey();
}

//userSchema.plugin(uniqueValidator, { message: 'Sorry, there is already a user with the {PATH}: {VALUE}. Please try again' });
  
module.exports = userSchema;