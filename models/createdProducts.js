const mongoose = require('mongoose');

let createProductSchema = new mongoose.Schema({
    profileId: String,
    name: String,
    description: Array,
    manufacturer: String,
    dateOfManufacture: {type: Date, default: Date.now},
    dateOfExpiry: Date,
    UUID: String
  })
  
module.exports = createProductSchema;