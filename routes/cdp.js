const express = require('express');
const app = express();
const router = express.Router();
const AppError = require('../errorHandling/AppError');
const compareImages = require('../imageProcessing/imageHash');

const primaryImage = 'https://ichef-1.bbci.co.uk/news/660/cpsprodpb/7F76/production/_95703623_mediaitem95703620.jpg';

router.get('/check', async function(req, res, next){
    try{
        const secondaryImage = req.body.img;
        let result = await compareImages(primaryImage, secondaryImage);
        res.json({result:result});
    }catch(err){
        console.log(err);
        next(err);
    }
})

module.exports = router;