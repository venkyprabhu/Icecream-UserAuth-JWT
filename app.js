const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser= require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://Venky:test1234@cluster0.cib0tco.mongodb.net/smoothies';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser )
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

// app.get('/set-cookies', (req,res) =>{
//   // res.setHeader('Set-Cookie','newUser=true')
//   res.cookie('newUser', false)
//   res.cookie('isEmployee', true, { maxAge: 1000*60*60*24, httpOnly:false, secure:true })

//   res.send('you got the cookies!!')
// })

// app.get('/read-cookies', (req,res) =>{
//   // res.setHeader('Set-Cookie','newUser=true')
//   const cookies= req.cookies
//   console.log(cookies)
//   res.json(cookies)
  

//   // res.send('you got the cookies!!')
// })

app.use(authRoutes)

