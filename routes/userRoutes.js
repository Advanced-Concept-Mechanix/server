const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SHA256 = require('crypto-js/sha256');
const AppError = require('../errorHandling/AppError');

const userSchema = require('../models/user');

const User = mongoose.model('User', userSchema);

router.post('/new', async function(req, res){

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
                console.log(err);
                return next(new AppError('Cannot generate public key', 500));
            }else{
                return pubKey;
            }
        });

        user.secretKey = user.getSecretKey(function(err, sKey){
            if(err){
                console.log(err);
                return next(new AppError('Cannot generate secret key', 500));
            }else{
                return sKey;
            }
        });

        user = await user.save(function(err, user){
            if(err){
                console.log(err);
                //let message = err.Error.message;
                // let message = err["Error"]["errors"]["name"]["message"] || err["Error"]["errors"]["email"]["message"];
                //res.status(500).json({Error:err});
                return next(new AppError(err, 500));
            }else{
                res.json({msg: "User successfully created"});
            }
        })
    } catch (err) {
        // res.status(400).json({
        //     status: 'fail',
        //     message: err
        // });
        return next(new AppError(err, 500));
    }
})

router.get('/', function(req, res){
    User.find({}, function(err, users){
        if(err){
            console.log(err);
            return next(new AppError(err, 500));
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
            return next(new AppError(err, 500));
        }else if(!user){
            return next(new AppError('No user found with that ID', 404));
            //res.json({msg: "No user by that id", success: false});
        }else{
            res.json({user:user, success: true});
        }
    })
})

router.delete('/delete/:id', function(req, res){

    let query = {_id:req.params.id};

    User.findByIdAndDelete(query, function(err, user){
        if(err){
            console.log(err);
            return next(new AppError(err, 500));
        }else if(!user){
            return next(new AppError('No user found with that ID', 404));
            //res.json({msg: "No user by that id", success: false});
        }else{
            res.json({msg: 'User deleted successfully', success: true});
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
            return next(new AppError(err, 500));
        }else if(!user){
            return next(new AppError('No user found with that ID', 404));
            //res.json({msg: "No user by that id", success: false});
        }else{
            res.json({msg:"User updated successfully", success: true});
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
            return next(new AppError('No user found with that ID', 404));
            //res.json({msg: "No user by that name", success: false, name: false});
        }else if(user.password == password){
            res.json({msg: "You have logged in successfully", success: true});
        }else{
            return next(new AppError('Your password is false', 400));
            //res.json({msg: "Your password is false", success: false, password: false});
        }
    })
});

module.exports = router;