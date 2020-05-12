const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const transactionSchema = require('../models/transactions');
const blockSchema = require('../models/blocks');

const Transaction = mongoose.model('Transaction', transactionSchema);
const Block = mongoose.model('Block', blockSchema);

router.post('/new', async function(req, res){

    try{
        let transactionSummary = await Transaction.find({}, function(err, transactions){
            if(err){
                console.log(err);
                res.status(500).json({msg: "Internal server error"});
            }else{
                return transactions;
            }
        });

        let latestBlock = await Block.find().sort({$natural:-1}).limit(1, function(err, latestBlock){
            if(err){
                console.log(err);
                res.status(500);
            }else{
                return latestBlock;
            }
        });

        let block = new Block();

        block.index = await block.getIndex(latestBlock);
        block.txSummary = transactionSummary;
        block.previousHash = latestBlock[0].hash;

        block.hash = block.calculateHash(function(err, hash){
            if(err){
                console.log(err);
                res.status(500);
            }else{
                return hash;
            }
        });

        block.nonce = block.mine(latestBlock, function(err, nonce){
            if(err){
                console.log(err);
                res.status(500);
            }else{
                return nonce
            }
        });

        await block.save(function(err, block){
            if(err){
                console.log(err);
                res.status(500);
            }else{
                Transaction.find().deleteMany(function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("transactions deleted");
                    }
                });
                res.status(200).json({msg:"block created successfully", block:block});
            }
        });

    }catch(err){
        console.log(err);
        res.status(500);
    }  
})

router.get('/', async function(req, res){
    let validity = await Block.checkValid(function(err, validity){
        if(err){
            console.log(err);
        }else{
            return validity;
        }
    });

    Block.find({}, function(err, blocks){
        if(err){
            console.log(err);
            res.status(500).json({msg: "Internal server error"});
        }else{
            res.json({validity:validity, blocks:blocks});
        }
    })
})

router.get('/find/:id', function(req, res){
    
    let query = {_id:req.params.id};

    Block.findById(query, function(err, block){
        if(err){
            console.log(err);
            res.status(500);
        }else if(!block){
            res.json({msg: "No block by that id", find: false});
        }else{
            res.json({block:block}).status(200);
        }
    })
})

router.get('/count', function(req, res){

    Block.countDocuments(function(err, count){
        if(err){
            res.status(500);
        }else{
            res.json({count:count}).status(200);
        }
    });
});

router.get('/:product', function(req, res){

    let query = {product:req.params.product};

    Block.find(query, function(err, blocks){
        if(err){
            res.status(500);
        }else{
            res.status(200).json({blocks:blocks});
        }
    })
});

// router.post('/genesis', async function(req,res){

//     let block = new Block();
//     block.index = 0;
//     block.txSummary = {};
//     block.previousHash = "0";

//     block.hash = block.calculateHash(function(err, hash){
//         if(err){
//             console.log(err);
//             res.status(500);
//         }else{
//             return hash;
//         }
//     });

//     block.nonce = 0;

//     await block.save(function(err, block){
//         if(err){
//             console.log(err);
//             res.status(500);
//         }else{
//             res.status(200).json({msg:"genesis block created", block:block});
//         }
//     });
// });

module.exports = router;