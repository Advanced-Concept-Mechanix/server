const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const expressWs = require('express-ws')(app);
const AppError = require('../errorHandling/AppError');

const aWss = expressWs.getWss('/');

const transactionStorageSchema = require('../models/transactionStorage');
const blockSchema = require('../models/blocks');

const TransactionStorage = mongoose.model('TransactionStorage', transactionStorageSchema);
const Block = mongoose.model('Block', blockSchema);

router.post('/new', async function(req, res, next){

    try{
        let transactionSummary = await TransactionStorage.find({}, function(err, transactions){
            if(err){
                console.log(err);
                next(err);
            }else{
                return transactions;
            }
        });

        let latestBlock = await Block.find().sort({$natural:-1}).limit(1, function(err, latestBlock){
            if(err){
                console.log(err);
                next(err);
            }else{
                return latestBlock;
            }
        });

        let block = new Block();

        block.index = await block.getIndex(latestBlock);
        block.txSummary = await block.getHash(transactionSummary, function(err, hash){
            if(err){
                next(err);
            }else{
                return hash;
            }
        });

        block.previousHash = latestBlock[0].hash;

        block.hash = block.calculateHash(function(err, hash){
            if(err){
                console.log(err);
                next(err);
            }else{
                return hash;
            }
        });

        block.nonce = block.mine(latestBlock, function(err, nonce){
            if(err){
                console.log(err);
                next(err);
            }else{
                return nonce
            }
        });

        await block.save(function(err, block){
            if(err){
                console.log(err);
                next(err);
            }else{
                TransactionStorage.find().deleteMany(function(err){
                    if(err){
                        console.log(err);
                        next(err);
                    }else{
                        console.log("transactions deleted");
                    }
                });
                res.status(200).json({msg:"block created successfully", block:block});
            }
        });

    }catch(err){
        console.log(err);
        next(err);
    }  
})

router.get('/', async function(req, res, next){
    let validity = await Block.checkValid(function(err, validity){
        if(err){
            console.log(err);
            next(err);
        }else{
            return validity;
        }
    });

    Block.find({}, function(err, blocks){
        if(err){
            console.log(err);
            next(err);
        }else{
            res.json({validity:validity, blocks:blocks});
        }
    })
})

router.get('/find/:id', function(req, res, next){
    
    let query = {_id:req.params.id};

    Block.findById(query, function(err, block){
        if(err){
            console.log(err);
            next(err);
        }else if(!block){
            return next(new AppError('No block with that id', 404));
        }else{
            res.json({block:block}).status(200);
        }
    })
})

router.get('/count', function(req, res, next){

    Block.countDocuments(function(err, count){
        if(err){
            next(err);
        }else{
            res.json({count:count}).status(200);
        }
    });
});

router.get('/:product', function(req, res, next){

    let query = {'txSummary.product':req.params.product};

    Block.find(query, function(err, blocks){
        if(err){
            next(err);
        }else{
            res.status(200).json({blocks:blocks});
        }
    })
});

//broadcast block to all nodes -- not tested yet
router.ws('/broadcast', function(ws,req){

  console.log('Socket Connected');

  ws.onmessage = function(msg) {
    console.log(msg.data);
    aWss.clients.forEach(function (client) {
      client.send(msg.data);
    });
  };
});

router.post('/genesis', async function(req,res, next){

    let block = new Block();
    block.index = 0;
    block.txSummary = {};
    block.previousHash = "0";

    block.hash = block.calculateHash(function(err, hash){
        if(err){
            console.log(err);
            next(err);
        }else{
            return hash;
        }
    });

    block.nonce = 0;

    await block.save(function(err, block){
        if(err){
            console.log(err);
            next(err);
        }else{
            res.status(200).json({msg:"genesis block created"});
        }
    });
});

module.exports = router;