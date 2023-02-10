const jwt= require('jsonwebtoken')
const User = require('../models/users')

const requireAuth= (req, res, next)=>{
    const token= req.cookies.jwt

    // check json web token exist & verified
    if(token){
        jwt.verify(token,'Venkyyy Secret', (err ,decodedToken )=>{
            if(err){
                console.log(err.message)
                res.redirect('/login')
            }
            else{
                console.log('Decoded Token=', decodedToken)
                next()
            }
        })
    }
    else{
        res.redirect('/login')
    }
}

// check current user
const checkUser= (req, res, next)=>{
    const token= req.cookies.jwt

    // check json web token exist & verified
    if(token){
        jwt.verify(token,'Venkyyy Secret', async(err, decodedToken )=>{
            if(err){
                console.log(err.message)
                res.locals.user= null
                next()
            }
            else{
                console.log('Decoded Token=', decodedToken)
                let user= await User.findById(decodedToken.id)
                res.locals.user= user
                next()
            }
        })
    }
    else{
        res.locals.user= null
        next()
    }
}

module.exports= {requireAuth, checkUser}