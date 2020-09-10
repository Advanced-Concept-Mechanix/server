const express = require('express');
const app = express();
const router = express.Router();
const AppError = require('../errorHandling/AppError');
const compareImages = require('../imageProcessing/imageHash');
const convertFromBase64 = require('../imageProcessing/convertFromBase64');
const delFile = require('../imageProcessing/deleteFile');
var path = require("path");

// const primaryImage = require('../imageProcessing/images/north_korea.jpg');

router.get('/check', async function(req, res, next){
    try{
        const base64Str = req.body.img;
        convertFromBase64(base64Str, 'secondary.jpg');
        let primaryPath = path.resolve('./routes/north_korea.jpg');
        let secondaryPath = path.resolve('../server/secondary.jpg');
        console.log(`primary: ${primaryPath}, secondary: ${secondaryPath}`);
        // compareImages('/home/linus/Desktop/server/server/routes/north_korea.jpg', '/home/linus/Desktop/server/server/secondary.jpg')
        compareImages(primaryPath, secondaryPath)
        .then((result) => {
            res.json({result:result});
        })
        //delFile('/home/linus/Desktop/server/server/secondary.jpg');
        // const secondaryImage = req.body.img;
        // let result = compareImages('/home/linus/Desktop/server/server/routes/north_korea.jpg', secondaryImage);
        // res.json({result:result});
    }catch(err){
        console.log(err);
        next(err);
    }
})

module.exports = router;