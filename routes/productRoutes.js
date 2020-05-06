const express = require('express');
const router = express.Router();

const Product = require('../models/product');

router.post('/newProduct', function(req, res){
    req.assert('name', 'Product name must be set').notEmpty();
    req.assert('description', 'Product description must be set').notEmpty();
    req.assert('manufacturer', 'Product manufacturer must be set').notEmpty();
    req.assert('daysBeforeExpiry', 'Product days before expiry must be set').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        console.log(errors)
    }else{
        let product = new Product();
        product.name = req.body.name;
        product.description = req.body.description;
        product.manufacturer = req.body.manufacturer;
        product.dateOfManufacture = req.body.dateOfManufacture;
        product.daysBeforeExpiry = req.body.daysBeforeExpiry;
    }

    product.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.status(200).json({msg: 'Product created', product})
        }
    })
})

router.get('/allProducts', function(req, res){
    Product.find({}, function(err, products){
        if(err){
            console.log(err);
        }else{
            res.json({products:products});
        }
    })
})

router.post('/singleProduct/:id', function(req, res){
    let product = {};
    product.name = req.body.name;
    product.description = req.body.description;
    product.manufacturer = req.body.manufacturer;
    product.dateOfManufacture = req.body.dateOfManufacture;
    product.daysBeforeExpiry = req.body.daysBeforeExpiry;

    let query = {_id:req.params.id};

    Product.findById(query, function(err, product){
        if(err){
            console.log(err);
        }else{
            res.json({product: product});
        }
    })
})