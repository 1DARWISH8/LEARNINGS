const jwt = require('jsonwebtoken')

function verifyToken(req,res,next)
{
    // token verification logic
        // get bearer token from headers of req object
        const bearerToken = req.headers.authorization;
        // get token
        if(bearerToken)
        {
            const Token = bearerToken.split(' ')[1]
            // verify token
            let decodedToken = jwt.verify(Token,process.env.SECRET_KEY)
            console.log(decodedToken)
            console.log(Token)
            next()
        }
        else
        {
            res.send({message:"User unauthorised"})
        }
}

module.exports=verifyToken
