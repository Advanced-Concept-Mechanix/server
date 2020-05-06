const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    name: String,
    uuid: mongoose.ObjectId,
    description: Array,
    manufacturer: String,
    dateOfManufacture: {type: Date, default: Date.now},
    daysBeforeExpiry: Number, 
    owners: Array
  })
  
module.exports = mongoose.model('Product', productSchema)