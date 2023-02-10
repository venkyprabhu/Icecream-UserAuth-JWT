const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt= require('bcrypt')
const Schema = mongoose.Schema

const userSchema= new Schema({
    email:{
        type: String,
        required: [true,'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid Email Id']
    },
    password:{
        type: String,
        required: [true,'Please enter the password'],
        minlength: [6, 'Mininum Password Length is 6 bruh']
    }
})

// // fire a function after doc is saved to db
// userSchema.post('save', function(doc, next){
//     console.log('new user was created and saved' , doc)
//     next()
// })

// fire a function before doc is saved to db
userSchema.pre('save', async function(next){
    const salt= await bcrypt.genSalt()
    this.password= await bcrypt.hash(this.password, salt)
    // console.log('new user before user was created and saved' , this)
    next()
})

// static function to login user
userSchema.statics.login= async function(email, password){
    const user = await this.findOne({email})

    if(user)
    {
        const auth= await bcrypt.compare( password, user.password)
        if(auth)
        {
            return user
        }
        throw Error('Incorrect Password')
    }
    throw Error('Incorrect Email')
}



const User= mongoose.model('user', userSchema)

module.exports= User