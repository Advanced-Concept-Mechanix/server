const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const transactionSchema = require('../models/transactions');

const Transaction = mongoose.model('Transaction', transactionSchema);

router.post('/new', async function(req, res){
    req.assert('user', 'user must be set').notEmpty();
    req.assert('location', 'location must be set').notEmpty();
    req.assert('product', 'product must be set').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        console.log(errors);
    }else{
        try{
            let transaction = new Transaction();
            transaction.user = req.body.user;
            transaction.location = req.body.location;
            transaction.product = req.body.product;

            transaction.hash = transaction.calculateHash(function(err, hash){
                if(err){
                    console.log(err)
                }else{
                    return hash;
                }
            });

            await transaction.save(function(err, transaction){
                if(err){
                    console.log(err);
                }else{
                    res.json({msg: "Transaction successfully created"});
                }
            })
        } catch(err){
            console.log(err);
            res.status(500);
        }
    }  
})

router.get('/', function(req, res){
    Transaction.find({}, function(err, transactions){
        if(err){
            console.log(err);
            res.status(500).json({msg: "Internal server error"});
        }else{
            res.json({transactions:transactions});
        }
    })
})

router.get('/find/:id', function(req, res){
    
    let query = {_id:req.params.id};

    Transaction.findById(query, function(err, transaction){
        if(err){
            console.log(err);
            res.status(500);
        }else if(!transaction){
            res.json({msg: "No ransaction by that id", find: false});
        }else{
            res.json({transaction:transaction}).status(200);
        }
    })
})

router.get('/count', function(req, res){

    Transaction.countDocuments(function(err, count){
        if(err){
            res.status(500);
        }else{
            res.json({count:count}).status(200);
        }
    });
});

router.get('/:product', function(req, res){

    let query = {product:req.params.product};

    Transaction.find(query, function(err, transactions){
        if(err){
            res.status(500);
        }else{
            res.status(200).json({transactions:transactions});
        }
    })
})

module.exports = router;