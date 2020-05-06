const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/user/new', function(req, res){
    req.assert('name', 'Username must be set').notEmpty();
    req.assert('email', 'Email must be set').notEmpty();
    req.assert('phone', 'Phone must be set').notEmpty();
    req.assert('company', 'Company must be set').notEmpty();
    req.assert('type', 'Type must be set').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        console.log(errors);
    }else{
        let user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.company = req.body.company;
        user.type = req.body.type;

        user.publicKey = user.getPublicKey(function(err, pubKey){
            if(err){
                console.log(err)
            }else{
                return pubKey;
            }
        });

        user.secretKey = user.getSecretKey(function(err, sKey){
            if(err){
                console.log(err)
            }else{
                return sKey;
            }
        });
    }

    user.save(function(err, user){
        if(err){
            console.log(err);
        }else{
            res.json({msg: "User successfully created", user:user});
        }
    })
})

router.get('/user/all', function(req, res){
    User.find({}, function(err, users){
        if(err){
            console.log(err);
        }else{
            res.json({users:users});
        }
    })
})

router.get('/user/find/:id', function(req, res){
    
    let query = {_id:req.params.id};

    User.findById(query, function(err, user){
        if(err){
            console.log(err);
        }else{
            res.json({user:user});
        }
    })
})

router.delete('/user/delete/:id', function(req, res){

    let query = {_id:req.params.id};

    User.findByIdAndDelete(query, function(err){
        if(err){
            console.log(err);
        }else{
            res.json({msg: 'User deleted successfully'});
        }
    })
})

router.post('/user/update/:id', function(req, res){
    let user = {};
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.company = req.body.company;
    user.type = req.body.type;
    user.publicKey = req.body.publicKey;
    user.secretKey = req.body.secretKey;

    let query = {_id:req.params.id};

    User.findByIdAndUpdate(query, user, function(err, user){
        if(err){
            console.log(err);
        }else{
            res.json({msg:"User updated successfully", user:user});
        }
    })
})