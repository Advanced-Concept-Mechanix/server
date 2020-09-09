const express = require('express');
const app = express();
const router = express.Router();
const AppError = require('../errorHandling/AppError');
const compareImages = require('../imageProcessing/imageHash');

// const primaryImage = require('../imageProcessing/images/north_korea.jpg');

router.get('/check', function(req, res, next){
    try{
        const secondaryImage = req.body.img;
        let result = compareImages('/home/linus/Desktop/server/server/routes/north_korea.jpg', secondaryImage);
        res.json({result:result});
    }catch(err){
        console.log(err);
        next(err);
    }
})

module.exports = router;