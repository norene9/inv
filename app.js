let bodyParser = require('body-parser');
let express = require('express')
let app = express()


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}))
 
// parse application/json
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true}))
var generalRouter=require('./routes/general')
  //moteur de view
app.set('view engine', 'ejs')
app.use('/',generalRouter)
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

//Listing to the server
app.listen(8000, ()=>{
    console.log('Server is running on port 8000...');
  })
  module.exports = app;