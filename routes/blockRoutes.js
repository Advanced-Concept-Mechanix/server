const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const blockSchema = require('../models/block');
const Block = mongoose.model('Block',blockSchema);

router.post('/new', async function(req, res){
    //req.assert('productId', 'Product ID must be set').notEmpty();
    req.assert('index', 'index must be set').notEmpty();
    req.assert('transactionSummary', 'transactionSummary must be set').notEmpty();
    req.assert('previousHash', 'previousHash must be set').notEmpty();
    req.assert('hash', 'hash must be set').notEmpty();
    req.assert('nonce', 'Product ID must be set').notEmpty();
    req.assert('difficulty', 'Product ID must be set').notEmpty();
    req.assert('validity', 'Product ID must be set').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        console.log(errors);
    }else{
        try{
            let block = new Block();

            //block.productId = req.body.productId;
            block.index = req.body.index;
            block.timestamp = req.body.timestamp;
            block.transactionSummary = req.body.transactionSummary;
            block.previousHash = req.body.previousHash;
            block.hash = req.body.hash;
            block.nonce = req.body.nonce;
            block.difficulty = req.body.difficulty;
            block.validity = req.body.validity;

            block = await block.save(function(err, block){
                if(err){
                    console.log(err);
                }else{
                    res.status(200).json({msg: 'Block created', block:block})
                }
            })
        }catch(err){
            console.log(err);
        }
    }
})

router.get('/', function(req, res){
    Block.find({}, function(err, blocks){
        if(err){
            console.log(err);
        }else{
            res.json({blocks:blocks});
        }
    })
})

router.get('/find/:id', function(req, res){
    
    let query = {_id:req.params.id};

    Block.findById(query, function(err, block){
        if(err){
            console.log(err);
        }else if(!block){
            res.json({msg: "No block by that id", find: false});
        }else{
            res.json({block:block});
        }
    })
})

router.get('/previous', function(req, res){

    Block.find().limit(1).sort({$natural: -1}).exec(function(err, block){
        if(err){
            console.log(err);
        }else{
            res.json({block:block});
        }
    });
})

module.exports = router;