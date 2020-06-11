const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SHA256 = require('crypto-js/sha256');
const AppError = require('../errorHandling/AppError');

const userSchema = require('../models/user');

const User = mongoose.model('User', userSchema);

router.post('/new', async function(req, res, next){

    try{
        let user = new User();
        user.name = req.body.name;
        user.password = SHA256(req.body.password);
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.company = req.body.company;
        user.type = req.body.type;
        user.question = req.body.question;
        user.answer = SHA256(req.body.answer);

        user.publicKey = user.getPublicKey(function(err, pubKey){
            if(err){
                console.log(err);
                next(err);
            }else{
                return pubKey;
            }
        });

        user.secretKey = user.getSecretKey(function(err, sKey){
            if(err){
                console.log(err);
                next(err);
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
                //return next(new AppError(err, 500));
                next(err);
            }else{
                res.status(200).json({msg: "User successfully created", success: true});
            }
        })
    } catch (err) {
        // res.status(400).json({
        //     status: 'fail',
        //     message: err
        // });
        //return next(new AppError(err, 500));
        next(err);
    }
})

router.get('/', function(req, res, next){
    User.find({}, function(err, users){
        if(err){
            console.log(err);
            //return next(new AppError(err, 500));
            next(err);
        }else{
            res.json({users:users});
        }
    })
})

router.get('/find/:id', function(req, res, next){
    
    let query = {_id:req.params.id};

    User.findById(query, function(err, user){
        if(err){
            console.log(err);
            next(err);
            //return next(new AppError(err, 500));
        }else if(!user){
            next(new AppError('No user found with that ID', 404));
            //res.json({msg: "No user by that id", success: false});
        }else{
            res.json({user:user, success: true});
        }
    })
})

router.delete('/delete/:id', function(req, res, next){

    let query = {_id:req.params.id};

    User.findByIdAndDelete(query, function(err, user){
        if(err){
            console.log(err);
            next(err);
            //return next(new AppError(err, 500));
        }else if(!user){
            next(new AppError('No user found with that ID', 404));
            //res.json({msg: "No user by that id", success: false});
        }else{
            res.json({msg: 'User deleted successfully', success: true});
        }
    })
})

router.post('/update/:id', function(req, res, next){
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let company = req.body.company;
    let type = req.body.type;
    let question = req.body.question;
    let answer = SHA256(req.body.answer);

    let query = {_id:req.params.id};

    User.findOne(query, async function(err, user){
        if(err){
            console.log(err);
            next(err);
            //return next(new AppError(err, 500));
        }else if(!user){
            next(new AppError('No user found with that ID', 404));
            //res.json({msg: "No user by that id", success: false});
        }else{
            user.name = name;
            user.email = email;
            user.phone = phone;
            user.company = company;
            user.type = type;
            user.question = question;
            user.answer = answer;
            await user.save(function(err, user){
                if(err){
                    next(err);
                }else{
                    res.status(200).json({msg:"User updated successfully", success: true});
                }
            })
        }
    })
})

router.post('/login', function(req, res, next){
    let email = req.body.email;
    let password = SHA256(req.body.password);

    let query = {email:email};

    User.findOne(query, function(err, user){
        if(err){
            console.log(err);
            next(err);
            //return next(new AppError(err, 500));
        }else if(!user){
            next(new AppError('No user found with that ID', 404));
            //res.json({msg: "No user by that name", success: false, name: false});
        }else if(user.password == password){
            res.json({msg: "You have logged in successfully", user: user});
        }else{
            next(new AppError('Your password is false', 400));
            //res.json({msg: "Your password is false", success: false, password: false});
        }
    })
});

router.post('/password/:email', function(req, res, next){
    let newPassword = req.body.password;

    let query = {email:req.params.email};

    User.findOne(query, async function(err, user){
        if(err){
            next(err);
        }else if(!user){
            next(new AppError('No user found with that EMAIL', 404));
        }else{
            user.password = SHA256(newPassword);
            await user.save(function(err, user){
                if(err){
                    next(err);
                }else{
                    res.status(200).json({user:user, msg:'Password updated successfully'});
                }
            })
        }
    })
})

router.get('/question/:email', function(req, res, next){

    let query = {email:req.params.email};

    User.findOne(query, function(err, user){
        if(err){
            next(err);
        }else if(!user){
            next(new AppError('No user found with that EMAIL', 404));
        }else{
            res.status(200).json({user:user});
        }
    })
})

module.exports = router;