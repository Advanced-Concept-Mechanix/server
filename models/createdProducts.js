const mongoose = require('mongoose');

let createProductSchema = new mongoose.Schema({
    profileId: {type:String, required:true},
    name: {type:String, required:true},
    description: {type:Array, required:true},
    manufacturer: {type:String, required:true},
    dateOfManufacture: {type: Date, default: Date.now},
    dateOfExpiry: {type:Date, required:true},
    UUID: {type:String, required:true}
  })
  
module.exports = createProductSchema;