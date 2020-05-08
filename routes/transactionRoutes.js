const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const transactionSchema = require('../models/transaction');
const Transaction = mongoose.model('Transaction', transactionSchema);

const blockSchema = require('../models/block');
const Block = mongoose.model('Block',blockSchema);

router.post('/new', async function(req, res){
    req.assert('userId', 'userId must be set').notEmpty();
    req.assert('location', 'location must be set').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        console.log(errors)
    }else{
        try{
            let transaction = new Transaction();
            transaction.userId = req.body.userId;
            transaction.location = req.body.location;

            transaction.hash = await transaction.calculateHash(transaction);

            let count = await Transaction.estimatedDocumentCount();

            await transaction.save(async function(err, transaction){
                if(err){
                    console.log(err);
                }else if(count >= 5){
                    let blockCount = await Block.estimatedDocumentCount();
                    let previousBlock = await Block.find().limit(1).sort({$natural: -1}).toObject();
                    let block = new Block();
                    block.index = blockCount + 1;
                    block.transactionSummary = await Transaction.find({});
                    block.previousHash = previousBlock.hash;
                    block.hash = await block.calculateHash(block.transactionSummary);
                    block.validity = block.previousHash === previousBlock.hash ? true : false;

                    await block.save(function(err, block){
                        if(err){
                            console.log(err);
                        }else{
                            Transaction.deleteMany({});
                            res.status(200).json({msg: 'Block created', block:block})
                        }
                    });
                }else{
                    res.status(200).json({msg: 'Transaction created', transaction:transaction});
                }
            })
        }catch(err){
            console.log(err);
        }
    }
});

router.get('/', function(req, res){

    Transaction.find({}, function(err, transactions){
        if(err){
            console.log(err);
        }else{
            res.json({transactions:transactions});
        }
    });
});

router.get('/find/:id', function(req, res){

    let query = {_id:req.params.id};

    Transaction.findById(query, function(err, transaction){
        if(err){
            console.log(err);
        }else if(!transaction){
            res.json({msg: "No transaction by that id", find: false});
        }else{
            res.json({transaction: transaction});
        }
    })
})
module.exports = router;