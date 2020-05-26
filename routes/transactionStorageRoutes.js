const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AppError = require('../errorHandling/AppError');

const transactionStorageSchema = require('../models/transactionStorage');

const TransactionStorage = mongoose.model('TransactionStorage', transactionStorageSchema);

router.get('/', function(req, res, next){
    TransactionStorage.find({}, function(err, transactions){
        if(err){
            console.log(err);
            next(err);
        }else{
            res.json({transactions:transactions});
        }
    })
})

router.get('/find/:id', function(req, res, next){
    
    let query = {_id:req.params.id};

    TransactionStorage.findById(query, function(err, transaction){
        if(err){
            console.log(err);
            next(err);
        }else if(!transaction){
            return next(new AppError('No transaction found with that ID', 404));
            //res.json({msg: "No ransaction by that id", find: false});
        }else{
            res.json({transaction:transaction}).status(200);
        }
    })
})

router.get('/count', function(req, res, next){

    TransactionStorage.countDocuments(function(err, count){
        if(err){
            next(err);
        }else{
            res.json({count:count}).status(200);
        }
    });
});

router.get('/:product', function(req, res, next){

    let query = {product:req.params.product};

    TransactionStorage.find(query, function(err, transactions){
        if(err){
            next(err);
        }else if(!transactions){
            return next(new AppError('No transactions found with that product ID', 404));
        }else{
            res.status(200).json({transactions:transactions});
        }
    })
})

module.exports = router;