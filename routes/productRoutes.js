const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const QRCode = require('qrcode');

const productSchema = require('../models/product');
const Product = mongoose.model('Product', productSchema);

router.post('/new', async function(req, res){
    req.assert('name', 'Product name must be set').notEmpty();
    req.assert('description', 'Product description must be set').notEmpty();
    req.assert('manufacturer', 'Product manufacturer must be set').notEmpty();
    req.assert('daysBeforeExpiry', 'Product days before expiry must be set').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        console.log(errors)
    }else{
        try{
            let product = new Product();
            product.name = req.body.name;
            product.description = req.body.description;
            product.manufacturer = req.body.manufacturer;
            product.dateOfManufacture = req.body.dateOfManufacture;
            product.daysBeforeExpiry = req.body.daysBeforeExpiry;

            product = await product.save(function(err, product){
                if(err){
                    console.log(err);
                }else{
                    res.status(200).json({msg: 'Product created'})
                }
            })
        }catch(err){
            console.log(err);
        }
    }  
})

router.get('/', function(req, res){
    Product.find({}, function(err, products){
        if(err){
            console.log(err);
        }else{
            res.json({products:products});
        }
    })
})

router.get('/find/:id', function(req, res){

    let query = {_id:req.params.id};

    Product.findById(query, function(err, product){
        if(err){
            console.log(err);
        }else if(!product){
            res.json({msg: "No product by that id", find: false});
        }else{
            res.json({product: product});
        }
    })
})

router.post('/update/:id', function(req, res){

    let query = {_id:req.params.id};

    Product.findOne(query, async function(err, product){
        if(err){
            console.log(err);
            res.status(500);
        }else if(!product){
            res.json({msg: "No product by that id", update: false});
        }else{
            product.name = req.body.name;
            product.description = req.body.description;
            product.manufacturer = req.body.manufacturer;
            product.dateOfManufacture = req.body.dateOfManufacture;
            product.daysBeforeExpiry = req.body.daysBeforeExpiry;

            await product.save(function(err, product){
                if(err){
                    res.status(500);
                }else{
                    res.json({msg: 'product updated successfully'});
                }
            });
        }
    })
})

router.delete('/delete/:id', function(req, res){
    let query = {_id:req.params.id};

    Product.findByIdAndDelete(query, function(err, product){
        if(err){
            console.log(err);
        }else if(!product){
            res.json({msg: "No product by that id", delete: false});
        }else{
            res.json({msg: 'Product deleted successfully'});
        }
    });
});

router.post('/qr/:id', function(req, res){
    let query = {_id:req.params.id};

    Product.findById(query, async function(err, product){
        if(err){
            console.log(err);
        }else{
            let qrImage = await QRCode.toFile(
                'qr.png',
                [product]
            );
            res.json({qrImage:qrImage});
        }
    });
});

module.exports = router;