const bcryptjs = require('bcryptjs')
const {ObjectId} = require('mongodb')
const jwt = require('jsonwebtoken')

const getUsers = async(req,res)=>
{
    // get userCollection from the request
    let usersCollection = req.app.get('usersCollection')
    // read all users
    let users = await usersCollection.find().toArray()
    // send response
    res.send({message:"users",payload:users})
};

const addUser = async(req,res)=>
{
    // get user from client through request
    let usersCollection = req.app.get('usersCollection')
    const user=req.body;
    // console.log(user)

    // Validate the user input data
    if (!user.username)
    {
        return res.send({message:"INPUT VALID USERNAME"})
    }
    if (!user.password)
    {
        return res.send({message:"INPUT PASSWORD"})
    }
    if (user.password.length<=4)
    {
        return res.send({message:"PASSWORD NEEDS TO BE MORE THAN 4 Characters"})
    }
    if (!user.email)
    {
        return res.send({message:"INPUT VALID EMAIL"})
    }

      // create the user
        // hash the password
        let hashed = await bcryptjs.hash(user.password,5)
        // replace plain password with hashed password
        user.password=hashed;
        // save user
        usersCollection.insertOne(user)
        //response
        res.status(201).send({"message":"USER CREATED"})
}

const updateUser = async(req,res)=>
{
    let usersCollection = req.app.get('usersCollection')
    // get modified user
    const user = req.body;
    // update user by id
    let dbRes = await usersCollection.updateOne({username:user.username},{$set:{...user}})
    res.status(200).send({message:"USER UPDATED"})
}

const deleteUser = async(req,res)=>
{
    let usersCollection = req.app.get('usersCollection')
    // get url param value
    // params always an object
    let ID=(req.params.id)

    let debRes = await usersCollection.deleteOne({_id:new ObjectId(ID)})
    console.log(debRes)
    if (debRes.deletedCount)
    {
        res.status(200).send({message:"USER IS DELETED"})
    }
    else
    {
        res.status(500).send({message:"DELETION UNSUCCESSFUL"})
    }
}

const userLogin = async(req,res)=>
{
    let usersCollection = req.app.get('usersCollection')
    // get user credentials from user
    let userCred = req.body;
    // check for data in db
    let userfromDb = await usersCollection.findOne({username:userCred.username})
    if (userfromDb===null)
    {
        res.status(404).send({"message":"INVALID USER"})
    }
    else
    {
        // user is found
            // compare passwords
            let result = await bcryptjs.compare(userCred.password,userfromDb.password)
            // if the password comparision returns true
            if (result)
            {
                let signedToken = jwt.sign({username:userfromDb.username},process.env.SECRET_KEY,{expiresIn:30})
                // send token to client
                res.status(200).send({message:"SUCCESSFUL LOGIN",token:signedToken,user:userfromDb})
            }
            // password comparision returns false
            else
            {
                res.status(404).send({"message":"PASSWORD IS INVALID"})
            }
    }
}

module.exports={getUsers,addUser,updateUser,deleteUser,userLogin}
