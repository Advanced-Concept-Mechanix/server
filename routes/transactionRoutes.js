const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AppError = require('../errorHandling/AppError');

const transactionStorageSchema = require('../models/transactionStorage');
const transactionSchema = require('../models/transactions');

const Transaction = mongoose.model('Transaction', transactionSchema);
const TransactionStorage = mongoose.model('TransactionStorage', transactionStorageSchema);

router.post('/new', async function(req, res, next){
   
    try{
        let transaction = new Transaction();
        transaction.user = req.body.user;
        transaction.location = req.body.location;
        transaction.product = req.body.product;
        transaction.createdAt = req.body.createdAt;

        transaction.hash = transaction.calculateHash(function(err, hash){
            if(err){
                console.log(err)
                next(err);
            }else{
                return hash;
            }
        });

        async function saveTx(tx){
            await tx.save(function(err, tx){
                if(err){
                    next(err);
                }else{
                    return tx;
                }
            })
        }

        async function saveTemp(tx){
            await saveTx(tx)
            .then(async(tx) => {
                let txTemp = tx[0];
                let txStorage = new TransactionStorage();
                txStorage._id = txTemp._id;
                txStorage.user = txTemp.user;
                txStorage.product = txTemp.product;
                txStorage.location = txTemp.location;
                txStorage.createdAt= txTemp.createdAt;
                txStorage.hash = txTemp.hash;

                await txStorage.save(function(err, tx){
                    if(err){
                        next(err);
                    }else{
                        res.json({msg: "Transaction successfully created", transaction:tx});
                    }
                })
            })
        }

        // await transaction.save(function(err, transaction){
        //     if(err){
        //         console.log(err);
        //         next(err);
        //     }else{
        //         res.json({msg: "Transaction successfully created", transaction:transaction});
        //     }
        // })

        saveTemp();
    } catch(err){
        console.log(err);
        next(err);
    } 
})

router.get('/', function(req, res, next){
    Transaction.find({}, function(err, transactions){
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

    Transaction.findById(query, function(err, transaction){
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

    Transaction.countDocuments(function(err, count){
        if(err){
            next(err);
        }else{
            res.json({count:count}).status(200);
        }
    });
});

router.get('/:product', function(req, res, next){

    let query = {product:req.params.product};

    Transaction.find(query, function(err, transactions){
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