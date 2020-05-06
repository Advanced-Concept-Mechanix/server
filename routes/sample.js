router.post('/new', async function(req, res){
    req.assert('name', 'Product name must be set').notEmpty();
    req.assert('description', 'Product description must be set').notEmpty();
    req.assert('manufacturer', 'Product manufacturer must be set').notEmpty();
    req.assert('daysBeforeExpiry', 'Product days before expiry must be set').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        console.log(errors)
    }else{
        try{
            let product = new Product();
            product.name = req.body.name;
            product.description = req.body.description;
            product.manufacturer = req.body.manufacturer;
            product.dateOfManufacture = req.body.dateOfManufacture;
            product.daysBeforeExpiry = req.body.daysBeforeExpiry;
            product.owners = req.body.owners;

            product = await product.save(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.status(200).json({msg: 'Product created', product})
                }
            })
        }catch(err){
            console.log(err);
        }
    }  
})