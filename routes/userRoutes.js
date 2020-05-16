const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SHA256 = require('crypto-js/sha256');

const userSchema = require('../models/user');

const User = mongoose.model('User', userSchema);

router.post('/new', async function(req, res){
    req.assert('name', 'Username must be set').notEmpty();
    req.assert('password', 'Password must be set').notEmpty();
    req.assert('email', 'Email must be set').notEmpty().isEmail();
    req.assert('phone', 'Phone must be set').notEmpty();
    req.assert('company', 'Company must be set').notEmpty();
    req.assert('type', 'Type must be set').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        console.log(errors);
        res.json({Error:errors});
    }else{
        try{
            let user = new User();
            user.name = req.body.name;
            user.password = SHA256(req.body.password);
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

            user = await user.save(function(err, user){
                if(err){
                    console.log(err);
                    res.json({Error:err.Error.errors.name.message || err.Error.errors.email.message});
                }else{
                    res.json({msg: "User successfully created"});
                }
            })
        } catch(err){
            console.log(err);
            res.json({Error:err});
        }
    }  
})

router.get('/', function(req, res){
    User.find({}, function(err, users){
        if(err){
            console.log(err);
        }else{
            res.json({users:users});
        }
    })
})

router.get('/find/:id', function(req, res){
    
    let query = {_id:req.params.id};

    User.findById(query, function(err, user){
        if(err){
            console.log(err);
        }else if(!user){
            res.json({msg: "No user by that id", find: false});
        }else{
            res.json({user:user});
        }
    })
})

router.delete('/delete/:id', function(req, res){

    let query = {_id:req.params.id};

    User.findByIdAndDelete(query, function(err, user){
        if(err){
            console.log(err);
        }else if(!user){
            res.json({msg: "No user by that id", delete: false});
        }else{
            res.json({msg: 'User deleted successfully'});
        }
    })
})

router.post('/update/:id', function(req, res){
    let user = {};
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.company = req.body.company;
    user.type = req.body.type;
    user.publicKey = req.body.publicKey;
    user.secretKey = req.body.secretKey;

    let query = {_id:req.params.id};

    User.findByIdAndUpdate(query, user, { runValidators: true, context: 'query' }, function(err, user){
        if(err){
            console.log(err);
        }else if(!user){
            res.json({msg: "No user by that id", update: false});
        }else{
            res.json({msg:"User updated successfully"});
        }
    })
})

router.get('/login', function(req, res){
    let username = req.body.name;
    let password = SHA256(req.body.password);

    let query = {name:username};

    User.findOne(query, function(err, user){
        if(err){
            console.log(err);
            res.json({err});
        }else if(!user){
            res.json({msg: "No user by that name", login: false, name: false});
        }else if(user.password == password){
            res.json({msg: "You have logged in successfully", login: true});
        }else{
            res.json({msg: "Your password is false", login: false, password: false});
        }
    })
});

module.exports = router;