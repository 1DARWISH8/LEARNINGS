// import express module into the back-end
const exp = require('express')
const petsApp = exp.Router()
const bcryptjs = require('bcryptjs')

let petCollection;
petsApp.use((req,res,next)=>
{
    petCollection=req.app.get('petCollection')
    next()
})

// Pets

// display the list of pets and their owners
petsApp.get('/pets',async(req,res)=>
{
    let pets = await petCollection.find().toArray()

    res.status(200).send({message:"PETS AND OWNERS", payload:pets})
})


// POST request to add new user
// to send new user and their pet data
petsApp.post('/pets',async(req,res)=>
{
    // get input from the client
    let input = req.body;
    // check if the data already exists
    let exists = await petCollection.findOne({owner:input.owner})
    if (exists)
    {
        res.status(400).send({message:"OWNER ALREADY EXISTS"})
    }
    else
    {
        let hashedpassword = await bcryptjs.hash(input.password,5)
        input.password = hashedpassword
        petCollection.insertOne(input)
        res.status(200).send({message:"OWNER AND DETAILS-ADDED"})
    }
})


// PUT REQUEST
    // TO UPDATE OWNER
    petsApp.put('/pets',async(req,res)=>
    {
        // get client input
        let input = req.body;
        let ID = "65c774b8eb19628263060010";
        console.log(input)
        console.log(input.owner)
        // check if the data to be updated is in the DB
        let exists = await petCollection.findOne({_id:ID})
        console.log(exists)
        if (exists)
        {
            await petCollection.updateOne({_id:ID},{$Set:{...input}})
            res.status(200).send({message:"USER UPDATED SUCCESSFULLY"})
        }
        else
        {
            res.status(400).send({message:"UPDATE FAILURE DUE TO USER NON EXISTANCE"})
        }
    })


// DELETE REQUEST
// TO DELETE A USER FROM DB
petsApp.delete('/pets/:owner',async(req,res)=>
{
    try
    {
        let Id = req.params.owner;
        console.log(Id)
        let deleted = await petCollection.deleteOne({owner: Id});
        console.log(deleted.deletedCount)
        if (deleted.deletedCount)
        {
            res.status(200).send({message:"USER DELETED"})
        }
        else
        {
            res.status(400).send({message:"ERROR IN DELETING"})
        }
    }
    catch(e)
    {
        res.send(e.message)
    }
})
// petsApp.delete('/pets/:id',async(req,res)=>
// {
//     try
//     {
//         let Id = req.params.id;
//         console.log(Id)
//         let deleted = await petCollection.deleteOne({_id: ObjectId(Id)});
//         console.log(deleted.deletedCount)
//         if (deleted.deletedCount)
//         {
//             res.status(200).send({message:"USER DELETED"})
//         }
//         else
//         {
//             res.status(400).send({message:"ERROR IN DELETING"})
//         }
//     }
//     catch(e)
//     {
//         res.send(e.message)
//     }
// })

module.exports=petsApp;
