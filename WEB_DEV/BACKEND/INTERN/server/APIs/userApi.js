// create express object
    const exp = require("express")
    // const app=exp()

    // create mini express app
    const userApp=exp.Router()
    // import bcryptjs
    const bcryptjs= require("bcryptjs")
    const jwt = require('jsonwebtoken')
    const verifyToken = require('../middlewares/verifytoken')
    const expressAsyncHandler = require('express-async-handler')
    const multer = require("multer")
    const cloudinary=require('cloudinary').v2;
    const cloudinaryStorage = require('cloudinary-multer')
    const {getUsers,addUser,updateUser,deleteUser,userLogin} = require('../controllers/userController')

    require('dotenv').config()   //process obj is global
    // process.env is made available 

    // configure
    cloudinary.config(
        {
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.CLOUD_API_KEY,
            api_secret:process.env.CLOUD_API_SECRET
        }
    )

    // configure cloudinary storage
    const storage = cloudinaryStorage(
        {
            cloudinary:cloudinary
        }
    )


    // middleware to access the collection through req
    // usersCollection is accessed
    let usersCollection;
    userApp.use((req,res,next)=>
    {
        usersCollection=req.app.get('usersCollection')
        next()
    })


    // middleware to stop the multer temporarily from creating data before username existance verification
    const checkduplicate=async(req,res,next)=>
    {
        // console.log(req)
        let user = req.body;
        // console.log(user)
        let userfromDb = await usersCollection.findOne({username:user.username})
        // console.log(userfromDb)
        if (userfromDb===null)
        {
            next()
        }
        else
        {
            res.status(400).send({message:"USERNAME ALREADY EXISTS"})
        }
    }

    const upload = multer({storage:storage})

    // get req
    userApp.get('/users',expressAsyncHandler(getUsers));
    
    // post req
    userApp.post('/users',checkduplicate,expressAsyncHandler(addUser))

    //put request 
    userApp.put('/users',expressAsyncHandler(updateUser))

    // delete request
    userApp.delete('/users/:id',expressAsyncHandler(deleteUser))

    // get user by id

    userApp.get('/users/:id',async(req,res)=>
    {
        // get user id from url params
        let id = Number(req.params.id);
        // find user by id
        let user = await usersCollection.findOne({id:id})
        // send res
        res.status(200).send({message:"user",payload:user})
    })


    // userApp.post('/users',checkduplicate,upload.single('image'),async(req,res)=>
    // {
    //     // get user from client
    //     const user=req.body;
    //     console.log(user)
    //     console.log(req.file.url)

    //     // add image url to the request body
    //     user.imagerUrl=req.file.url

    //     // Validate the user input data
    //     if (!user.username)
    //     {
    //         return res.send({message:"INPUT VALID USERNAME"})
    //     }
    //     if (!user.password)
    //     {
    //         return res.send({message:"INPUT PASSWORD"})
    //     }
    //     if (user.password.length<=4)
    //     {
    //         return res.send({message:"PASSWORD NEEDS TO BE MORE THAN 4 Characters"})
    //     }
    //     if (!user.email)
    //     {
    //         return res.send({message:"INPUT VALID EMAIL"})
    //     }

    //     // check for duplicate user in db
    //     // let userfromDb= await usersCollection.findOne({username:user.username})
    //     // if user doesn't exists
    //     // if (userfromDb===null)
    //     {
    //         // create the user
    //             // hash the password
    //             let hashed = await bcryptjs.hash(user.password,5)
    //             // replace plain password with hashed password
    //             user.password=hashed;
    //             // save user
    //             usersCollection.insertOne(user)
    //             //response
    //             res.status(201).send({"message":"USER CREATED"})
    //     }
    //     // else
    //     // {
    //     //     res.status(200).send({"message":"username already exists"})
    //     // }
    // })
    



    // login

    userApp.post('/user-login',expressAsyncHandler(userLogin))


    // protected / private route

    userApp.get('/protected',verifyToken,(req,res)=>
    {
        console.log(req.headers)
        res.send({message:"Protected"})
    })


module.exports=userApp;
