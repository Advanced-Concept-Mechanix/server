const express = require('express');
const app = express();
const router = express.Router();
const AppError = require('../errorHandling/AppError');
const compareImages = require('../imageProcessing/imageHash');
const convertFromBase64 = require('../imageProcessing/convertFromBase64');

// const primaryImage = require('../imageProcessing/images/north_korea.jpg');

router.get('/check', async function(req, res, next){
    try{
        const base64Str = req.body.img;
        convertFromBase64(base64Str, 'secondary.jpg')
        let result = compareImages('/home/linus/Desktop/server/server/routes/north_korea.jpg', '/home/linus/Desktop/server/server/secondary.jpg');
        res.json({result:result});
        // const secondaryImage = req.body.img;
        // let result = compareImages('/home/linus/Desktop/server/server/routes/north_korea.jpg', secondaryImage);
        // res.json({result:result});
    }catch(err){
        console.log(err);
        next(err);
    }
})

module.exports = router;