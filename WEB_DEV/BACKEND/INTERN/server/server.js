// create express application
    const exp=require('express')
    const app=exp()

    // get mongoDB client
    const mc = require('mongodb').MongoClient;
    // connect to mongodb server
    mc.connect('mongodb://localhost:27017')
    .then((client)=>
    {
        // get DB object
        const dbObj= client.db('sampledb')
        // get collection object
        const usersCollection = dbObj.collection('users')
        const productsCollection = dbObj.collection('products')
        const petCollection = dbObj.collection('pets')

        // adds userCollection to express obj(app)
        app.set('usersCollection',usersCollection)
        app.set('productsCollection',productsCollection)
        app.set('petCollection',petCollection)

        console.log("connected to database server")
    })
    .catch(err=>
    {
        console.log("ERROR WHILE CONNECTING TO DataBase")
    })

    const userApp = require('./APIS/userApi')
    const productApp = require('./APIS/productAPI')
    const petsApp = require('./APIS/petsAPI')

    // add body parser
    app.use(exp.json()) //built-in middleware 
    // if not used then it becomes undefined

    // execute app according to the path which uses path-level middleware
    app.use('/user-api',userApp)
    app.use('/product-api',productApp)
    app.use('/pets-api',petsApp)

    // create middleware
    // function test1Middleware(req,res,next)
    // {
        // console.log("middleware-1 working")
        // res.send({message:"something went wrong in middleware1"})
        // next()
    // }
    // function test2Middleware(req,res,next)
    // {
    //     console.log("middleware-2 working")
    //     // res.send({message:"something went wrong in middleware2"})
    //     next()
    // }

    // use as app level middleware
    // app.use(test1Middleware)
    // app.use(test2Middleware)

    // USER API- api contains routes
    // USER API(route)
    
    // error handling middleware

    function errorHandler(err,req,res,next)
    {
        res.send({message:"error occured",payload:err.message})
    }
    app.use(errorHandler)

// assign port number

const PORT=process.env.PORT||5000

app.listen(PORT,()=>console.log("http server is listening"))
