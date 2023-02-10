const User= require('../models/users')
const jwt= require('jsonwebtoken')

const handleErrors= (err)=>{
    console.log(err.message, err.code)
    let errors= {email: '', password:''}

    // incorrect email
    if(err.message=="Incorrect Email")
    {
        errors.email= 'This email is not registered'
    }

    if(err.message=="Incorrect Password")
    {
        errors.password= 'Incorrect Password, Please reenter the password'
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation error
    if(err.message.includes('user validation failed'))
    {      
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path]= properties.message
        })
    }
    return errors
}

const maxAge= 3*24*60*60   // in sec
const createToken= (id)=>{
    // 2nd parameter should be secret key(hidden when uploaded anywhere)
    return jwt.sign({ id} , 'Venkyyy Secret', {
        expiresIn: maxAge,
    })
}


const sign_up_get= (req,res)=>{
    res.render('signup')
}

const login_get= (req,res)=>{
    res.render('login')
}

const sign_up_post= async(req,res)=>{
    const {email, password} = req.body

    try{
        const user= await User.create({email, password})
        const token= createToken(user._id)

        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})
        res.status(201).json({user: user._id})
    }
    catch(err){
        errors= handleErrors(err)
        res.status(400).json({errors})
    }
}

const login_post= async(req,res)=>{
    const {email, password} = req.body

    try{
        const user= await User.login(email, password)
        const token= createToken(user._id)

        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})
        res.status(201).json({user: user._id})
    }
    catch(err){
        errors= handleErrors(err)
        res.status(400).json({errors})
    }
    console.log(email, password)
}

const logout_get= (req,res)=>{
    res.cookie('jwt','', {maxAge:1})
    res.redirect('/')
}

module.exports={
    sign_up_get, 
    login_get, 
    sign_up_post, 
    login_post,
    logout_get 
  }