let bodyParser = require('body-parser');
let express = require('express')
let app = express()
var cookieParser=require('cookie-parser')

var session=require('express-session')
//const bootstrap = require('bootstrap')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}))
app.use(cookieParser())
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});

 //for authentifiacation
 let crypto = require('crypto')
 let passport=require('passport')
 let LocalStrategy=require('passport-local').Strategy
// parse application/json
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true}))
app.use(passport.initialize())
var userRouter=require('./routes/passport')
app.use('/passport',userRouter);
//express session
app.use(session({
  cookie:{httpOnly:false},
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  secret: 'is a secret',
  cookie:{
    maxAge: 1000 * 60 * 60 * 2,
    sameSite: true,
    secure: false
  }
}))
app.set('trust proxy',1)
app.use(passport.session());

var generalRouter=require('./routes/general');
const { Users } = require('./sequelize');

  //moteur de view
app.set('view engine', 'ejs')
app.use('/',generalRouter)
//this for calling the static files .js .css images
app.use('/', express.static('assets'))
;
app.use(express.static(__dirname+'/public'))
app.get('/ajout', (request, response) => {
  response.render('Ajout')
})
app.get('/index', (request, response) => {
  response.render('index')
})
app.get('/generic', (request, response) => {
  response.render('generic')
})
app.get('/Add_Eq', (request, response) => {
  response.render('Add_Eq')
})
app.get('/Add_User', (request, response) => {
  response.render('Add_User')
})
app.get('/BL', (request, response) => {
  response.render('BL')
})
app.get('/Teachers', (request, response) => {
  response.render('Teachers')
})


//Listing to the server
app.listen(8000, ()=>{
    console.log('Server is running on port 8000...');
  })
  module.exports = app;