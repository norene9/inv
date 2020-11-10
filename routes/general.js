var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router(); 
const { Composants } = require('../sequelize');
const { Users } = require('../sequelize');
const {TypeUser} = require('../sequelize');
const {Bon_Livraison} = require('../sequelize');
const {Groups} = require('../sequelize');
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
//===============GET HOME PAGE=============//
router.get('/',async  function(req, res, next) {
    var cmp = await Composants.findAll()
    console.log(cmp)
    res.render('index',{cmp})
   
 
 });
 //============GET BL===========//
 router.get('/BL',async function(req,res,next){
   var BL=await Bon_Livraison.findAll()
   res.render('BL',{BL})
 })
 //=============ADD BL===========//
 router.post('/Add_BL',async function(req,res,next){
   try{
    await Bon_Livraison.create({numero:req.body.num,date:req.body.date})
    res.redirect('BL')
   }catch(err){
     next(err)
   }
  
})
//=================DELETE BL===============//
router.post('/Delete_BL',urlencodedParser,async  function(req, res, next) {
  try{
      console.log(req.body.compid )
      await Bon_Livraison.destroy({
      where: {
          id: req.body.idBL 
        }
    });
    res.redirect('BL');
  }catch (err) {
      next(err);
    }

      })
      //=========Add BL Content===========//
      router.get('/BL/:id',async function(req,res,next){
        let id=req.params.id
        try{
          var BL=await Bon_Livraison.findAll({where:{id:id}})
        res.render('BL',{BL})
        }catch(err){
          next(err)
        }
        
      })
 //==================GET TEACHERS PAGE============//
 router.get('/Teachers',async  function(req, res, next) {
    res.render('Teachers')
    
    });
    router.post('/Teachers',async  function(req, res, next) {
    
      res.render('Teachers')
      });
    //=======ADD NEW USER==========//
    router.post('/Add_User',urlencodedParser,async  function(req, res, next) {
      try{
   await TypeUser.findOne({where:{typeu:req.body.typeid}}).then(( async type=>{
    await Users.create({firstName:req.body.nom,lastName:req.body.prenom,email:req.body.email,password:'12',typeUserId:type.id})
   }))
        
    res.redirect('Add_User')
      }catch(err){
        next(err)  
      }
      console.log(user)});
      router.post('/Add_User1',urlencodedParser,async  function(req, res, next) {
        try{
          
          await TypeUser.create({typeu:req.body.type})
          
            res.redirect('Add_User')
        }catch(err){
          next(err)
        }
        console.log(user)});
   
        router.get('/Add_User',async  function(req, res, next) {
          try{
            
            
    var tuser=await TypeUser.findAll()
              res.render('Add_User',{tuser})
          }catch(err){
            next(err)
          }
      });
         //=============GET Equipement===========// 
        router.get('/Add_Eq',async  function(req, res, next) {
          try{
            
          var composant=await Composants.findAll()
              res.render('Add_Eq',{composant})
          }catch(err){
            next(err)
          }
         });
         //=================DELETE Equipement===============//
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
           //======================Add Equipement=============//
            router.post('/Add_Eq',urlencodedParser,async  function(req, res, next) {
                   
        await Composants.create({name:req.body.nom,quantity:'0',quantity_dispo:'0'})
        
        
                res.redirect('Add_Eq')});
               



   
module.exports = router;
