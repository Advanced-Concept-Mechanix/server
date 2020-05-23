const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const AppError = require('../errorHandling/AppError');

const productSchema = require('../models/product');
const Product = mongoose.model('Product', productSchema);

router.post('/new', async function(req, res, next){

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
                next(err);
            }else{
                res.status(200).json({msg: 'Product created', success: true})
            }
        })
    }catch(err){
        console.log(err);
        next(err);
    }  
})

router.get('/', function(req, res, next){
    Product.find({}, function(err, products){
        if(err){
            console.log(err);
            next(err);
        }else{
            res.json({products:products});
        }
    })
})

router.get('/find/:id', function(req, res, next){

    let query = {_id:req.params.id};

    Product.findById(query, function(err, product){
        if(err){
            console.log(err);
            next(err);
        }else if(!product){
            return next(new AppError('No product with that id', 404));
        }else{
            res.json({product: product});
        }
    })
})

router.post('/update/:id', function(req, res, next){

    let query = {_id:req.params.id};

    Product.findOne(query, async function(err, product){
        if(err){
            console.log(err);
            next(err);
        }else if(!product){
            return next(new AppError('No product with that id', 404));
            //res.json({msg: "No product by that id", update: false});
        }else{
            product.name = req.body.name;
            product.description = req.body.description;
            product.manufacturer = req.body.manufacturer;
            product.daysBeforeExpiry = req.body.daysBeforeExpiry;

            await product.save(function(err, product){
                if(err){
                    next(err);
                }else{
                    res.json({msg: 'product updated successfully', success: true});
                }
            });
        }
    })
})

router.delete('/delete/:id', function(req, res, next){
    let query = {_id:req.params.id};

    Product.findByIdAndDelete(query, function(err, product){
        if(err){
            console.log(err);
            next(err);
        }else if(!product){
            return next(new AppError('No product with that id', 404));
            //res.json({msg: "No product by that id", delete: false});
        }else{
            res.json({msg: 'Product deleted successfully', success: true});
        }
    });
});

router.post('/qr/:id', function(req, res, next){
    let query = {_id:req.params.id};

    Product.findById(query, async function(err, product){
        if(err){
            console.log(err);
            next(err);
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