var express = require('express');

var bodyParser = require('body-parser')
var router = express.Router(); 
const { Composants } = require('../sequelize');
const { Users } = require('../sequelize');
 
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.json())
function returnsPromise() {
    return new Promise(function (resolve, reject) {
      reject(Error('I was never going to resolve.'))
    })
  }

router.get('/',async  function(req, res, next) {
    var cmp = await Composants.findAll()
    console.log(cmp)
    res.render('index',{cmp})
   
 
 });
 //==================GET TEACHERS LIST============//
 router.get('/Teachers',async  function(req, res, next) {
    var teacher = await Users.findAll()
    console.log(teacher)
    res.render('Teachers',{teacher})
    });
    //=======ADD NEW USER==========//
    router.get('/Add_User',async  function(req, res, next) {
        
        res.render('Add_User')});
        router.get('/Add_Eq',async  function(req, res, next) {
        var composant=await Composants.findAll()
            res.render('Add_Eq',{composant})});
            router.post('/Delete_comp',urlencodedParser,async  function(req, res, next) {
                try{
                    console.log(req.body.compid )
                    await Composants.destroy({
                    where: {
                        id: req.body.compid 
                      }
                  });
                  res.redirect('Add_Eq');
                }catch (err) {
                    next(err);
                  }
              
                    })
           
            router.post('/Add_Eq',urlencodedParser,async  function(req, res, next) {
                
        await Composants.create({name:req.body.nom,quantity:'0',quantity_dispo:'0'})
                res.redirect('Add_Eq')});
               



   
module.exports = router;
