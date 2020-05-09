const express = require('express');
const router = express.Router();


const Blockchain = require('../blockchain/main');
const Transaction = require('../blockchain/transaction');
const Block = require('../blockchain/block');
const txSummary = require('../blockchain/txsummary');

router.post('/new', function(req, res){
    req.assert('user', 'User must be set').notEmpty();
    req.assert('product', 'Product must be set').notEmpty();
    req.assert('location', 'Location must be set').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        console.log(errors)
        res.status(500);
    }else{
        let user = req.body.user;
        let product = req.body.product;
        let location = req.body.location;

        let transaction = new Transaction(user, product, location);

        txSummary.addTx(transaction);

        if(txSummary.count() < 5){
            res.json({msg: "transaction added to txSummary", transaction:transaction, txSummary:txSummary});
        }else{
            let transactionSummary = [...txSummary.transactionSummary];
            let block = new Block(transactionSummary);
            Blockchain.addBlock(block);
            //txSummary.transactionSummary.length = 0;
            txSummary.transactionSummary.splice(0,txSummary.transactionSummary.length);
            res.json({msg: "transaction added and block created", txSummary:txSummary, Blockchain:Blockchain});
        }
    }
});

module.exports = router;

//console.log(JSON.stringify(Blockchain, null, 4));