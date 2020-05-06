const express = require('express');
const router = express.Router();

const Block = require('../models/block');

router.post('/new', async function(req, res){
    req.assert('productId', 'Product ID must be set').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        console.log(errors);
    }else{
        try{
            let block = new Block();

            let latestDoc = Block.latestDoc(function(err, latestDoc){
                if(err){
                    console.log(err)
                }else{
                    return latestDoc;
                }
            });

            block.productId = req.body.productId;

            block.index = block.getIndex(latestDoc, function(err, index){
                if(err){
                    console.log(err)
                }else{
                    return index;
                }
            });

            block.previousHash = block.getPreviousHash(latestDoc, function(err, previousHash){
                if(err){
                    console.log(err)
                }else{
                    return previousHash;
                }
            });

            block.hash = block.calculateHash(function(err, hash){
                if(err){
                    console.log(err)
                }else{
                    return hash;
                }
            });

            block.validity = Block.checkValidity(latestDoc, function(err, validity){
                if(err){
                    console.log(err)
                }else{
                    return validity;
                }
            });

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
        }else{
            res.json({block:block});
        }
    })
})

module.exports = router;