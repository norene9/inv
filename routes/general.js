var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router(); 

const { Composants } = require('../sequelize');
const { Users } = require('../sequelize');
const {TypeUser} = require('../sequelize');
const {Bon_Livraison} = require('../sequelize');
const {Groups} = require('../sequelize');
const {BL_Content} = require('../sequelize');

// create application/json parser
var jsonParser = bodyParser.json()
var generator = require('generate-password');
const { render } = require('../app');
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
 //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>GESTION DE STOCK<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 //------------------------------Nomoclature-----------------------------
   //======================Add Equipement (Nomoclature)=============//
   router.post('/Add_Eq',urlencodedParser,async  function(req, res, next) {
    try{
     await Composants.create({name:req.body.nom,quantity:'0',quantity_dispo:'0'})
     res.redirect('Add_Eq')
    } catch(err)  {
     //next(err)
     res.send('opps')
     
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
     //=============Edit Equipement===========// 
     router.post('/Eq_Edit',async  function(req, res, next) {
      try{
     
       Composants.update({
         name:req.body.edit
       },{
         where:{
           id:req.body.id
         }
       })
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
    //-----------------------------------------------------------------------------------------------------------------
    //--------------------------------BON DE LIVRAISON------------------------------------------
 
  //=============ADD BL===========//
  router.post('/Add_BL',async function(req,res,next){
    try{
     await Bon_Livraison.create({numero:req.body.num,date:req.body.date})
     res.redirect('BL')
    }catch(err){
      next(err)
    }
   
 })
 //============GET BL===========//
 router.get('/BL',async function(req,res,next){
   var BL=await Bon_Livraison.findAll()
   res.render('BL',{BL})
 })
  //=========GET BL  FoR Adding  Content===========//
  router.get('/BL_Cont/:id',async function(req,res,next){
    let id=req.params.id
    try{
      var BL=await Bon_Livraison.findOne({where:{id:id}})
      //var content= await BL_Content.findAll({where:{blId:req.params.id}})
      var cmp=await Composants.findAll()
      var content= await BL_Content.findAll({where:{blId:req.params.id},include:[Composants]})
     
    res.render('BL_Cont',{BL,cmp,content})
    }catch(err){
      next(err)
    }
    
  })
  //=========SHOW BL  Content===========//
  router.get('/BL_details/:id',async function(req,res,next){
    let id=req.params.id
    try{
      var BL=await Bon_Livraison.findOne({where:{id:id}})
      //var content= await BL_Content.findAll({where:{blId:req.params.id}})
      var cmp=await Composants.findAll()
      var content= await BL_Content.findAll({where:{blId:req.params.id},include:[Composants]})
     
    res.render('BL_details',{BL,cmp,content})
    }catch(err){
      next(err)
    }
    
  })
   //=========Add BL Content===========//
   router.post('/BL_cont/:id',urlencodedParser, async function(req,res,next){
    try{
      let idb=req.params.id
      await Composants.findOne({where:{name:req.body.type}}).then(( async type=>{
        await BL_Content.create({cquantity:req.body.quantite,blId:idb,composantId:type.id})
      await Composants.increment('quantity',{by:req.body.quantite,where:{id:type.id}})
      await Composants.increment('quantity_dispo',{by:req.body.quantite,where:{id:type.id}})
      }))
        res.redirect([idb])
     }catch(err){
       next(err)
     }
   ext(err)  })
   
   //========================DELETE BL CONTENT================//
router.get('/delete_con/:id',async function(req,res,next){
  try {
    var bl=await BL_Content.findOne({
      where:{id:req.params.id}
    })
await BL_Content.findOne({
  where:{id:req.params.id}
}).then((async material=>{
  await Composants.decrement('quantity',{by:material.cquantity,where:{id:material.composantId}})
  await Composants.decrement('quantity_dispo',{by:material.cquantity,where:{id:material.composantId}})
  await BL_Content.destroy({where:{id:req.params.id}})
  res.redirect('/BL_cont/'+[bl.blId])
}))
  }catch(err){
next(err)
  }
});

//============DELETE BL===========//
router.get('/delete/:id',async function(req, res, next) {
  try{
    await BL_Content.findAll({where:{blId:req.params.id}}).then( async con=>{
      for(var i=0;i<con.length;i++){
      
        await Composants.decrement('quantity',{by:con[i].cquantity,where:{id:con[i].composantId}})
        await Composants.decrement('quantity_dispo',{by:con[i].cquantity,where:{id:con[i].composantId}})
      }
      
      await BL_Content.destroy({
        where: {blId:req.params.id }
      })
      await Bon_Livraison.destroy({
        where: {
            id: req.params.id 
          }
      });
      
      res.redirect('/BL')
    })
  }catch(err){
    next(err)
  }
 
  


})
//=================DELETE BL===============//
router.post('/Delete_BL',urlencodedParser,async  function(req, res, next) {
  try{
      
      await Bon_Livraison.destroy({
      where: {
          id: req.body.idBL1 
        }
    });
    res.redirect('BL');
  }catch (err) {
      next(err);
    }

      })
     
     /* router.get('/BL_cont/:id',async function(req,res,next){
        let id=req.params.id
        try{
          var BL=await Bon_Livraison.findOne({where:{id:id}})
          var cmp=await Composants.findAll()
        res.render('BL_Cont',{BL,cmp})
        }catch(err){
          next(err)
        }
        
      })*/
   
     
 //==================GET TEACHERS PAGE============//
 router.get('/Teachers',async  function(req, res, next) {
   try{
    /*var use = await TypeUser.findOne({where:{typeu:'Admin'}}).then(async t=>{
      await Users.findAll({where:{typeUserId:t.id}})})
      console.log(use)*/
      var use=[]
      var user = await TypeUser.findOne({where:{typeu:'Enseignant'}})
      if (user!==null){
        use= await Users.findAll({where:{typeUserId:user.id}})
        res.render('Teachers',{use})
      } else res.render('Teachers',{use})
     
   }catch(err){
     next(err)
    }
  });
    router.post('/Teachers',async  function(req, res, next) {
    
      res.render('Teachers')
      });
    //=======ADD NEW USER==========//
    router.post('/Add_User',urlencodedParser,async  function(req, res, next) {
      try{
        var password = generator.generate({
          length: 10,
          numbers: true
      });
   await TypeUser.findOne({where:{typeu:req.body.typeid}}).then(( async type=>{
    await Users.create({firstName:req.body.nom,lastName:req.body.prenom,email:req.body.email,password:password,typeUserId:type.id})
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
     
       
         
          
               



   
module.exports = router;
