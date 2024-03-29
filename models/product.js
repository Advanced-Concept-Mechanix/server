const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    name: {type:String, unique: true},
    description: Array,
    manufacturer: String,
    dateOfManufacture: {type: Date, default: Date.now},
    daysBeforeExpiry: Number
  })
  
module.exports = productSchema;