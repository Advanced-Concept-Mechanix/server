const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AppError = require('../errorHandling/AppError');

const createProductSchema = require('../models/createdProducts');
const CreateProduct = mongoose.model('CreateProduct', createProductSchema);

router.post('/new', async function(req, res, next){

    try{
        let product = new CreateProduct();
        product.profileId = req.body.profileId;
        product.name = req.body.name;
        product.description = req.body.description;
        product.manufacturer = req.body.manufacturer;
        product.dateOfManufacture = req.body.dateOfManufacture;
        product.dateOfExpiry = req.body.dateOfExpiry;
        product._id = req.body.UUID;

        product = await product.save(function(err, product){
            if(err){
                console.log(err);
                next(err);
            }else{
                res.status(200).json({msg: 'Product created', success: true, product:product})
            }
        })
    }catch(err){
        console.log(err);
        next(err);
    }  
})

router.post('/newBatch', async function(req, res, next){

    try{
  
        let data = req.body.qrDataSet;
  
        CreateProduct.insertMany(data, {ordered:true},function(err, dataset){
            if(err){
                next(err);
            }else{
                res.json({dataset:dataset});
            }
        });
  
    }catch(err){
        console.log(err);
        next(err);
    }  
  })

router.get('/', function(req, res, next){
    CreateProduct.find({}, function(err, products){
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

    CreateProduct.findById(query, function(err, product){
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

router.get('/:profileId', function(req, res, next){

    let query = {profileId:req.params.profileId};

    CreateProduct.find(query, function(err, products){
        if(err){
            console.log(err);
            next(err);
        }else if(!products){
            next(new AppError('No product for that profile', 404));
        }else{
            res.status(200).json({products: products});
        }
    })
})

router.post('/update/:id', function(req, res, next){

    let query = {_id:req.params.id};

    CreateProduct.findOne(query, async function(err, product){
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
            product.dateOfExpiry = req.body.dateOfExpiry;

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

    CreateProduct.findByIdAndDelete(query, function(err, product){
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

module.exports = router;