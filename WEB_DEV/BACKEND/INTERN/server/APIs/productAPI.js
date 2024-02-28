const exp=require('express')
const productApp=exp.Router()

// middleware to access the collection from request object

let productsCollection;

    productApp.use((req,res,next)=>
    {
        productsCollection = req.app.get('productsCollection')
        next()
    })

    
    // Products

    // display the list of products
    productApp.get('/products',async(req,res)=>
    {
        // access the products through "find"
        let product = await productsCollection.find().toArray()
        // send response
        res.send({message:"products",payload:product})
    }
    )

    // Update the list of products by adding new products
    productApp.post('/products',async(req,res)=>
    {
        // get new product data from user
        const product = req.body;
        // check if the product already exists
        let indb = await productsCollection.findOne({pname:product.pname})
        // check if the db already contains the product being added
        if (indb===null)
        {
            // add the new product
            productsCollection.insertOne(product)
            res.send({message:"Product is added"})
        }
        else
        {
            res.status(404).send({message:"Product already exists"})
        }
    })

    // list of products is updated
    productApp.put('/products',async(req,res)=>
    {
        // get user input for the data to be updated
        let product = req.body;
        // check if the product is in the db
        let pdb = await productsCollection.findOne({pid:product.pid})
        if (pdb === null)
        {
            res.status(200).send({message:"Product doesn't exist"})
        }
        else
        {
            productsCollection.updateOne({pid:pdb.pid},{$set:{...product}})
            res.status(200).send({message:"Product is updated"})
        }
    })

    // delete products from list
    productApp.delete('/products/:pid', async(req,res)=>
    {
        let pid = Number(req.params.pid)

        let pdb = await productsCollection.deleteOne({pid:pid})
        console.log(pdb)
        res.status(200).send({message:"product is deleted"})
    })

module.exports=productApp;
