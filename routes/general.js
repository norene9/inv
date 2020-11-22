var express = require('express');
const nodemailer = require("nodemailer");
var bodyParser = require('body-parser')
var router = express.Router(); 
var dialog = require('dialog');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nnours180@gmail.com',
    pass: 'hichiron9991' // naturally, replace both with your real credentials or an application-specific password
  }
});

const { Composants } = require('../sequelize');
const { Users } = require('../sequelize');
const {TypeUser} = require('../sequelize');
const {Bon_Livraison} = require('../sequelize');
const {Groups} = require('../sequelize');
const {BL_Content} = require('../sequelize');
const {Promo} = require('../sequelize');
const {Etudiants} = require('../sequelize');
const {Chefs} = require('../sequelize');
const{Bc}=require('../sequelize')
const{Bc_Content}=require('../sequelize')
const{N_retourne}=require('../sequelize')
// create application/json parser
var jsonParser = bodyParser.json()
var generator = require('generate-password');
const { Router } = require('express');
const User = require('../models/User');
const { route } = require('../app');
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
 
  try{
  
      var types= await TypeUser.findAll();
    console.log(types)
    if(types.length==0){
    var admin= await TypeUser.create({typeu:'Admin'})
      TypeUser.create({typeu:'Enseignant'})
      TypeUser.create({typeu:'Consultateur'})
      Users.create({firstName:'admin_principale',lastName:'admin_principale',email:'a.a@esi-sba.dz',password:'esi',typeUserId:admin.id})
      
      console.log(req.isAuthenticated())
res.redirect('/login')
    }else{
      res.redirect('/login')
    }
  
  }catch(err){
    next(err)
  }
 
    
   
 
 });
 
router.get('/login', async function(req,res,next){
    
  res.render('login')
 
})
router.get('/logout',function(req,res){
  req.logOut();
  res.redirect('/login')
})
 
 //================login Function=================//
 var loggedin=function(req,res,next){
   console.log(req.user)
   if(req.isAuthenticated()){

    console.log('kkk')
    
     next()
     
   }else{
     res.redirect('/login')
   }
 }
 //==========GET USER==========================//
 router.get('/user',loggedin,async function(req,res,next){
   //console.log(req.session.passport.user)
  console.log(req.user.id)
  var us= await Users.findOne({where:{id:req.user.id}})
  var type=await TypeUser.findOne({where:{id:us.typeUserId}})
  if (type.typeu=='Admin'){
   var cpi_1= await Promo.findOne({where:{promo:'1CPI'}})
    var cpi_2=await Promo.findOne({where:{promo:'2CPI'}})
   var cs_1= await Promo.findOne({where:{promo:'1CS'}})
    var cs_2w=await Promo.findOne({where:{promo:'2CS(SIW)'}})
    var cs_2i=await Promo.findOne({where:{promo:'2CS(ISI)'}})
    var cs_3w= await Promo.findOne({where:{promo:'3CS(SIW)'}})
    var cs_3i= await Promo.findOne({where:{promo:'3CS(ISI)'}})
    if (cpi_1==null){Promo.create({promo:'1CPI'})}
    if (cpi_2==null){Promo.create({promo:'2CPI'})}
    if (cs_1==null){Promo.create({promo:'1CS'})}
    if (cs_2w==null){Promo.create({promo:'2CS(SIW)'})}
    if (cs_2i==null){Promo.create({promo:'2CS(ISI)'})}
    if (cs_3i==null){Promo.create({promo:'3CS(ISI)'})}
    if (cs_2w==null){Promo.create({promo:'3CS(SIW)'})}
    var bc =await Bc.findAll({include:[{model:Promo},{model:Groups}],order:[['id','DESC']]})
    res.render('index',{bc})}
  if (type.typeu=='Enseignant'){
    try{
    console.log(req.isAuthenticated())
    
var promo2CPI=await Promo.findOne({where:{promo:'2CPI'}})
var promo1CPI=await Promo.findOne({where:{promo:'1CPI'}})
var promo1CS=await Promo.findOne({where:{promo:'1CS'}})
var promo2CS_SIW=await Promo.findOne({where:{promo:'2CS(SIW)'}})
var promo2CS_ISI=await Promo.findOne({where:{promo:'2CS(ISI)'}})
var promo3CS_SIW=await Promo.findOne({where:{promo:'3CS(SIW)'}})
var promo3CS_ISI=await Promo.findOne({where:{promo:'3CS(ISI)'}})
var groupe=await Groups.findAll({include:[Promo]})
  res.render('./user_pages/NewDemande',{groupe,promo1CS,promo1CPI,promo2CPI,promo2CS_ISI,promo3CS_SIW,promo3CS_ISI,promo2CS_SIW})
  }catch(err){next(err)}
    
  }
  if (type.typeu=='Consultateur'){
    res.redirect('/liste_demandec')
  }
 })
 //======================Forget password=============//
 router.get('/forget_password',async function(req,res,next){
   res.render('forget_password')
 })
 router.post('/forget_password',async function(req,res,next){
   try{
    var user= await Users.findOne({where:{email:req.body.email}})
    var email=req.body.email
        const mailOptions = {
          from: 'nnours180@gmail.com',
          to: user.email,
          subject: 'Pssword',
          text: 'Your password in the inventory website is:'+user.password
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
          console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        dialog.info('Verifier votre email.... ', function(exitCode) {
          if (exitCode == 0) res.redirect('/login')
      })
   }catch(err){
next(err)
   }
  
  
})
router.get('/profile',async function(req,res,next){
  var user=await Users.findOne({where:{id:req.user.id},include:[TypeUser]})
  res.render('Profile',{user})
})
router.get('/profileu',async function(req,res,next){
  var user=await Users.findOne({where:{id:req.user.id},include:[TypeUser]})
  res.render('./user_pages/profileu',{user})
})
router.post('/change',async function(req,res,next){
  await Users.update({password:req.body.pass},{where:{id:req.body.id}})
  res.redirect('logout')
})

router.get('/Demande',async function(req,res,next){
  try{
    console.log(req.isAuthenticated())
    //console.log(req.session.passport.user)

    //console.log(req.user.id)
    //var bcommande =await Bc.create({userId:req.session.passport.user})
var promo2CPI=await Promo.findOne({where:{promo:'2CPI'}})
var promo2CS=await Promo.findOne({where:{promo:'2CS(SIW)'}})
var promo3CS=await Promo.findOne({where:{promo:'3CS(SIW)'}})
var groupe=await Groups.findAll({include:[Promo]})
  res.render('./user_pages/NewDemande',{groupe,promo2CPI,promo2CS,promo3CS})
  }catch(err){next(err)}
  

})
router.get('/Demande/:id',async function(req,res,next){
  try{
    var message="nothing"
    var bcn=req.params.id
    var bc=await Bc.findOne({where:{id:bcn}})
    var promo =await Promo.findAll()
    var composant=await Composants.findAll()
    var groupe=await Groups.findAll({include:[Promo]})
    var content=await Bc_Content.findAll({where:{bcId:bcn},include:[Composants]})
    console.log(content[0])
    res.render('./user_pages/Demande',{groupe,promo,bcn,composant,content,bc,message})
  }catch(err){
next(err)
  }
  })
  router.post('/Edit_bc',async function(req,res,nex){
    await Bc_Content.update({quantity:req.body.edit},{where:{id:req.body.id}})
    var bc=await Bc_Content.findOne({where:{id:req.body.id}})
    Bc.update({etat:'en-attente'},{where:{id:bc.bcId}})
    res.redirect('/Demande/'+bc.bcId)
  })
  router.post('/Ajout',async function(req,res,next){
    try{
      if(req.body.tajout=='groupe'){
        console.log(req.body.numero)
        var team= await Groups.findOne({where:{numero:req.body.numero}})
      var bc=  await Bc.create({userId:req.user.id,teamId:team.id,promoId:req.body.promo,etat:'en attente',Titre:req.body.titre})
      
       res.redirect('/Demande/'+bc.id) 
      }
      if(req.body.tajout=='bcon'){
        console.log(req.body.numero)
        var composant=await Composants.findOne({where:{name:req.body.composant}})
        var bc=await Bc.findOne({where:{id:req.body.bc}})
        if(req.body.quantite>composant.quantity_dispo){
          dialog.err('La Quantite demander est superieur a la quantite disponible.... ', 'Error', function(exitCode) {
            if (exitCode == 0) res.redirect('/Demande/'+req.body.bc)
        })
        
        }else{ await Bc_Content.create({quantity:req.body.quantite,composantId:composant.id,bcId:req.body.bc,promoId:bc.promoId})
        res.redirect('/Demande/'+req.body.bc) }
       
      }
    
    }catch(err){
  next(err)
    }
    })
    //========================Liste des Demande===========///////
    router.get('/liste_demande',async function(req,res,next){
 
    
    var demande=await Bc.findAll({include:[Promo]})
    
      res.render('liste_demande',{demande})
    })
    //===========liste demande pour consultateur=========//
    router.get('/liste_demandec',async function(req,res,next){
 
    
      var demande=await Bc.findAll({include:[Promo]})
      
        res.render('./consultateur/liste_demande',{demande})
      })
      //=============liste details pour admin===//
    router.get('/liste_Details/:id',async function(req,res,next){
 
      var demande=await Bc_Content.findAll({where:{bcId:req.params.id},
       include: [
        
         {model: Composants},
         {model: Promo},
        ],
       attributes: ['id','quantity'], 
     })
     
     var bcId=req.params.id
       res.render('liste_Details',{demande,bcId})
     })
     //=============liste details pour consultateur============///
     router.get('/liste_Detailsc/:id',async function(req,res,next){
 
      var demande=await Bc_Content.findAll({where:{bcId:req.params.id},
       include: [
        
         {model: Composants},
         {model: Promo},
        ],
       attributes: ['id','quantity'], 
     })
     
     var bcId=req.params.id
       res.render('./consultateur/liste_Details',{demande,bcId})
     })
     //===========liste valide pour admin==//////////
     router.get('/liste_valide/:id',async function(req,res,next){
 
      var demande=await Bc_Content.findAll({where:{bcId:req.params.id},
       include: [
        
         {model: Composants},
         {model: Promo},
        ],
       attributes: ['id','quantity'], 
     })
     
     var bcId=req.params.id
       res.render('liste_Valide',{demande,bcId})
     })
     //===========liste valide pour consultateur==//////////
     router.get('/liste_validec/:id',async function(req,res,next){
 
      var demande=await Bc_Content.findAll({where:{bcId:req.params.id},
       include: [
        
         {model: Composants},
         {model: Promo},
        ],
       attributes: ['id','quantity'], 
     })
     
     var bcId=req.params.id
       res.render('./consultateur/liste_Valide',{demande,bcId})
     })
       //============liste valide pour admin==//
     router.post('/liste_valide',async function(req,res,next){
       try{
        if(req.body.quantity_r==req.body.composantQuantity){
          var bc=await Bc_Content.findOne({where:{id:req.body.idc}})
          bcId=bc.bcId;
          await Composants.increment('quantity',{by:req.body.quantity_r,where:{id:bc.composantId}})
          await Composants.increment('quantity_dispo',{by:req.body.quantity_r,where:{id:bc.composantId}})
          await Bc_Content.destroy({where:{id:req.body.idc}})
          res.redirect('/liste_valide/'+bcId)
        }else{
          var b=await Bc_Content.findOne({where:{id:req.body.idc}})
          var bc=await Bc.findOne({where:{id:b.bcId}})
          var chef= await Chefs.findOne({where:{teamId:bc.teamId}})
          await Composants.increment('quantity_dispo',{by:req.body.quantity_r,where:{id:b.composantId}})
          var quantity_lost=parseInt(req.body.composantQuantity)-parseInt(req.body.quantity_r)
          await Composants.decrement('quantity',{by:quantity_lost,where:{id:b.composantId}})
          console.log(parseInt(quantity_lost))
  await N_retourne.create({quantity:quantity_lost,composantId:req.body.composantId,chefId:chef.id,etudiantId:chef.etudiantId})
  res.redirect('/liste_valide/'+bc.id)
        }
       }catch(err){
         next(err)
       }
    
     })
     //============liste valide pour consultateur==//
     router.post('/liste_validec',async function(req,res,next){
      try{
       if(req.body.quantity_r==req.body.composantQuantity){
         var bc=await Bc_Content.findOne({where:{id:req.body.idc}})
         bcId=bc.bcId;
         await Composants.increment('quantity',{by:req.body.quantity_r,where:{id:bc.composantId}})
         await Composants.increment('quantity_dispo',{by:req.body.quantity_r,where:{id:bc.composantId}})
         await Bc_Content.destroy({where:{id:req.body.idc}})
         res.redirect('/liste_validec/'+bcId)
       }else{
         var b=await Bc_Content.findOne({where:{id:req.body.idc}})
         var bc=await Bc.findOne({where:{id:b.bcId}})
         var chef= await Chefs.findOne({where:{teamId:bc.teamId}})
         await Composants.increment('quantity_dispo',{by:req.body.quantity_r,where:{id:b.composantId}})
         var quantity_lost=parseInt(req.body.composantQuantity)-parseInt(req.body.quantity_r)
         await Composants.decrement('quantity',{by:quantity_lost,where:{id:b.composantId}})
         console.log(parseInt(quantity_lost))
 await N_retourne.create({quantity:quantity_lost,composantId:req.body.composantId,chefId:chef.id,etudiantId:chef.etudiantId})
 res.redirect('/liste_validec/'+bc.id)
       }
      }catch(err){
        next(err)
      }
   
    })
     router.get('/etDette',async function(req,res,next){
       try{
        var etudiant=await N_retourne.findAll({include:[{model:Etudiants},{model:Chefs},{model:Composants}]})
        res.render('etDette',{etudiant})
       }catch(err){next(err)}

     })
     //============eDette pour consultateur==///////
     router.get('/etDettec',async function(req,res,next){
      try{
       var etudiant=await N_retourne.findAll({include:[{model:Etudiants},{model:Chefs},{model:Composants}]})
       res.render('./consultateur/etDette',{etudiant})
      }catch(err){next(err)}

    })
     router.post('/Edit_valide',async function(req,res,next){
       try{
         if(req.body.qretourner==req.body.qretourner){N_retourne.destroy({where:{id:req.body.renid}})}
        await N_retourne.decrement('quantity',{by:req.body.qretourner,where:{id:req.body.renid}})
        await Composants.increment('quantity',{by:req.body.qretourner,where:{id:req.body.composantId}})
        await Composants.increment('quantity_dispo',{by:req.body.qretourner,where:{id:req.body.composantId}})
        res.redirect('/etDette')
        
       }catch(err){
         next(err)
       }
     })
     //============edit valide pour consultateur==//
     router.post('/Edit_validec',async function(req,res,next){
      try{
        if(req.body.qretourner==req.body.qretourner){N_retourne.destroy({where:{id:req.body.renid}})}
       await N_retourne.decrement('quantity',{by:req.body.qretourner,where:{id:req.body.renid}})
       await Composants.increment('quantity',{by:req.body.qretourner,where:{id:req.body.composantId}})
       await Composants.increment('quantity_dispo',{by:req.body.qretourner,where:{id:req.body.composantId}})
       res.redirect('./consultateur/etDette')
       
      }catch(err){
        next(err)
      }
    })
     router.post('/etat/:id',async function(req,res,next){
       try{
            if(req.body.etat=='valide-att'){
        await Bc.update({etat:'valide-en-attente'},{where:{id:req.params.id}})
         res.redirect('/liste_Details/'+req.params.id)
       }else
       if(req.body.etat=='refuser'){
       await Bc.update({etat:'refuser'},{where:{id:req.params.id}})
        res.redirect('/liste_Details/'+req.params.id)
      }
      else
       if(req.body.etat=='valide'){
        await Bc.update({etat:'valide'},{where:{id:req.params.id}})
        res.redirect('/liste_Details/'+req.params.id)
      }
       }catch(err){
         next(err)
       }
   
     })
     router.post('/etatc/:id',async function(req,res,next){
      try{
           if(req.body.etat=='valide-att'){
       await Bc.update({etat:'valide-en-attente'},{where:{id:req.params.id}})
        res.redirect('/liste_Detailsc/'+req.params.id)
      }else
      if(req.body.etat=='refuser'){
      await Bc.update({etat:'refuser'},{where:{id:req.params.id}})
       res.redirect('/liste_Detailsc/'+req.params.id)
     }
     else
      if(req.body.etat=='valide'){
       await Bc.update({etat:'valide'},{where:{id:req.params.id}})
       res.redirect('/liste_Detailsc/'+req.params.id)
     }
      }catch(err){
        next(err)
      }
  
    })
     router.get('/Confirmer/:id',async function(req,res,next){
      var bc=await Bc.findOne({where:{id:req.params.id}})
      Bc.update({etat:'valide'},{where:{id:bc.id}})
      var bcontent=await Bc_Content.findAll({where:{bcId:bc.id},include:[Composants]})
      console.log(bcontent.length)
      for(var i=0;i<bcontent.length;i++){
        await Composants.decrement('quantity_dispo',{by:bcontent[i].quantity,where:{id:bcontent[i].composant.id}})
      }
      res.redirect('/Liste_demande_Ens')
     })
     //==================liste demande pour ens==========//
     router.get('/Liste_demande_Ens',async function(req,res,next){
       var demande=await Bc.findAll({where:{userId:req.user.id},include:[{model:Promo},{model:Groups}]})
       res.render('./user_pages/Liste_demande_Ens',{demande})
     })
     //============Detail pour demande refuser================//
     router.get('/liste_Details_Refuser/:id',async function(req,res,next){
var demande=await Bc_Content.findAll({where:{bcId:req.params.id},include:[Composants]})
var bcId=demande[0].bcId
res.render('./user_pages/liste_Details_Refuser',{demande,bcId})
     })
     router.get('/Supprimer_Demande/:id',async function(req,res,next){
       Bc_Content.destroy({where:{bcId:req.params.id}})
       Bc.destroy({where:{id:req.params.id}})
       res.redirect('/Liste_demande_Ens')

     })

 //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>GESTION DE STOCK<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 //------------------------------Nomoclature-----------------------------
   //======================Add Equipement (Nomoclature)=============//
   router.post('/Add_Eq',urlencodedParser,async  function(req, res, next) {
    try{
     await Composants.create({name:req.body.nom,quantity:'0',quantity_dispo:'0'})
     res.redirect('/Add_Eq')
    } catch(err){
     //next(err)
      dialog.err('Material Exist deja ', 'Error', function(exitCode) {
            if (exitCode == 0) res.redirect('/Add_Eq')})
     
      }    
 
});
  //=============GET Equipement===========// 
  router.get('/Add_Eq',async  function(req, res, next) {
    try{
      console.log(req.session.passport.user)
    var composant=await Composants.findAll()
        res.render('Add_Eq',{composant})
    }catch(err){
      next(err)
    }
   });
     //=============Edit Equipement===========// 
     router.post('/Eq_Edit',async  function(req, res, next) {
      try{
     
       await Composants.update({
         name:req.body.edit
       },{
         where:{
           id:req.body.id
         }
       })
       var composant=await Composants.findAll()
        res.redirect('/Add_Eq')
         
      }catch(err){
        //next(err)
        dialog.err('Material Exist deja ', 'Error', function(exitCode) {
          if (exitCode == 0) res.redirect('/Add_Eq')})
      }
     });
     router.post('/BL_con_Edit',async  function(req, res, next) {
      try{
     var bl=await BL_Content.findOne({where:{id:req.body.id}})
     await BL_Content.findOne({where:{id:req.body.id}}).then(async reslt=>{
      await Composants.decrement('quantity',{by:reslt.cquantity,where:{id:reslt.composantId}})
      await Composants.decrement('quantity_dispo',{by:reslt.cquantity,where:{id:reslt.composantId}})
      await Composants.increment('quantity',{by:req.body.edit,where:{id:reslt.composantId}})
      await Composants.increment('quantity_dispo',{by:req.body.edit,where:{id:reslt.composantId}})
     })
     
       BL_Content.update({
         cquantity:req.body.edit
       },{
         where:{
           id:req.body.id
         }
       })
       res.redirect('/BL_cont/'+bl.blId)
         
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
     console.log(content)
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
      var user= await Users.findAll({include:[TypeUser]})
      console.log(user,'llllllllllllllllll')
      console.log(req.session.passport.user)
      res.render('Teachers',{user})
     
   }catch(err){
     next(err)
    }
  });
    router.post('/Teachers',async  function(req, res, next) {
    
      res.render('Teachers')
      });
      
     
      //===========================ADD PROMO===============///
      router.post('/Add_promo',urlencodedParser,async  function(req, res, next) {
        try{
          
          await Promo.create({promo:req.body.n_promo})
          
            res.redirect('Groups')
        }catch(err){
          next(err)
        }
        });
        router.get('/find_promo_1CPI',async function(req,res,next){
          var promo_2= await Promo.findOne({where:{promo:'1CPI'}})
          res.redirect('/Groups/'+promo_2.id)
        })
        router.get('/Groups/:id',urlencodedParser,async  function(req, res, next) {
          try{
            console.log(req.user.id)
            var promo_2= await Promo.findOne({where:{id:req.params.id}})
          var group=  await Groups.findAll({where:{promoId:req.params.id}})
          console.log(group)
   res.render('Groups_2CPI',{group,promo_2})  
          }catch(err){
            next(err)
          }
          });
        router.get('/del_gr/:id',async function(req,res,next){
          try{
            var bc= await Bc.findOne({where:{teamId:req.params.id}})
            var gr=await Groups.findOne({where:{id:req.params.id}})
            var promo=await Promo.findOne({where:{id:gr.promoId}})
            console.log(bc)
            if (bc==null){ 
             var et= await Etudiants.findOne({where:{teamId:req.params.id}})
             if (et!==null){await Chefs.destroy({where:{etudiantId:et.id}})}
             
              await Etudiants.destroy({where:{teamId:req.params.id}})
            await Groups.destroy({where:{id:req.params.id}})
            res.redirect('/Groups/'+promo.id)
           }
            else{
              dialog.err('Il y aun bon de commande pour ce groupe la suppression ', 'Error', function(exitCode) {
                if (exitCode == 0) res.redirect('/Add_Eq')})
            }
          }catch(err){
            next(err)
          }
       
         
        })
        router.get('/Decharge/:id',async function(req,res,next){
          try{
            var demande=await Bc_Content.findAll({where:{bcId:req.params.id},include:[Composants]})
          
          var bc=await Bc.findOne({where:{id:req.params.id},include:[Promo]})
          var team=await Groups.findOne({where:{id:bc.teamId}})
          var use=await Users.findOne({where:{id:bc.userId}})
          console.log(use.firstName,'llllllllllllllllllllllllllllllllllll')
          var chef=await Chefs.findOne({include:[{model:Etudiants},{model:Groups}]})
          res.render('Decharge',{demande,team,chef,bc,use})
          }catch(err){next(err)}
          
        })
        router.get('/Dechargec/:id',async function(req,res,next){
          try{
            var demande=await Bc_Content.findAll({where:{bcId:req.params.id},include:[Composants]})
          
          var bc=await Bc.findOne({where:{id:req.params.id},include:[Promo]})
          var team=await Groups.findOne({where:{id:bc.teamId}})
          var use=await Users.findOne({where:{id:bc.userId}})
          console.log(use.firstName,'llllllllllllllllllllllllllllllllllll')
          var chef=await Chefs.findOne({include:[{model:Etudiants},{model:Groups}]})
          res.render('./consultateur/Decharge',{demande,team,chef,bc,use})
          }catch(err){next(err)}
          
        })
        //==================GET GROUPS===================//
        router.get('/find_promo_2CS_SIW',urlencodedParser,async  function(req, res, next) {
          try{
            var promo_2= await Promo.findOne({where:{promo:'2CS(SIW)'}})
         res.redirect('/Groups/'+promo_2.id)  
          }catch(err){
            next(err)
          }
          });
      router.get('/find_promo_2CPI',urlencodedParser,async  function(req, res, next) {
        try{
          var promo_2= await Promo.findOne({where:{promo:'2CPI'}})
        res.redirect('/Groups/'+promo_2.id)  
        }catch(err){
          next(err)
        }
        });
       
          router.get('/find_promo_1CS',urlencodedParser,async  function(req, res, next) {
            try{
              var promo_2= await Promo.findOne({where:{promo:'1CS'}})
              res.redirect('/Groups/'+promo_2.id)  
            }catch(err){
              next(err)
            }
            });
        router.get('/find_promo_2CS_ISI',urlencodedParser,async  function(req, res, next) {
          try{
            var promo_2= await Promo.findOne({where:{promo:'2CS(ISI)'}})
          var group=  await Groups.findAll({where:{promoId:promo_2.id}})
          res.redirect('/Groups/'+promo_2.id)  
          }catch(err){
            next(err)
          }
          });
         
          router.get('/find_promo_3CS_ISI',urlencodedParser,async  function(req, res, next) {
            try{
              var promo_2= await Promo.findOne({where:{promo:'3CS(ISI)'}})
              res.redirect('/Groups/'+promo_2.id)  
            }catch(err){
              next(err)
            }
            });
            router.get('/find_promo_3CS_SIW',urlencodedParser,async  function(req, res, next) {
              try{
                var promo_2= await Promo.findOne({where:{promo:'3CS(SIW)'}})
                res.redirect('/Groups/'+promo_2.id)  
              }catch(err){
                next(err)
              }
              });
            

        //=====ADD GROUP================//
        router.post('/Add_group',async function(req,res,next){
         var p= await Promo.findOne({where:{id:req.body.promo}})
         console.log(p)
         await Groups.create({numero:req.body.numero,promoId:p.id})
          
          res.redirect('/Groups/'+p.id)
        })
         //=====ADD GROUP================//
         router.get('/Add_et/:id',async function(req,res,next){
           try{
            var group= await Groups.findOne({where:{id:req.params.id}})
            var etudiant= await Etudiants.findAll({where:{teamId:req.params.id}})
            var chef=await Chefs.findOne({where:{teamId:req.params.id},include:[Etudiants]})
            console.log(chef)
              res.render('Add_Et',{group,etudiant,chef})
           }catch(err){
             next(err)
           }
      
        })
        //===========ADD Chef=========//
        router.post('/Add_chef',async function(req,res,next){
          var groupe =await Groups.findOne({where:{id:req.body.groupId}})
          await Etudiants.create({firstName:req.body.c_nom,lastName:req.body.c_prenom,email:req.body.c_email,teamId:req.body.groupId,
            promoId:groupe.promoId}).then((async et=>{
             Chefs.create({etudiantId:et.id,teamId:req.body.groupId}) 
             res.redirect('/Add_et/'+req.body.groupId)
          }))
        })
        //===========ADD membre=========//
        router.post('/Add_membre',async function(req,res,next){
          var groupe =await Groups.findOne({where:{id:req.body.groupId}})
          await Etudiants.create({firstName:req.body.m_nom,lastName:req.body.m_prenom,email:req.body.m_email,teamId:req.body.groupId,
          promoId:groupe.promoId})
             res.redirect('/Add_et/'+req.body.groupId)
          
        })
        //===============DELETE ETUDIANT===============//
        router.get('/delete_etu/:id',async function (req,res,next){
         var et = await Etudiants.findOne({where:{id:req.params.id}})
         
          var chefs =await Chefs.findOne({where:{etudiantId:req.params.id}})
          console.log(chefs)
          if (chefs == null){  await Etudiants.destroy({where:{id:req.params.id}})}
          else{
            dialog.err('Vous ne pouvez pas suprimer un chef', 'Error', function(exitCode) {
              if (exitCode == 0) res.redirect('/Add_Eq')})
          }
         
          res.redirect('/Add_et/'+et.teamId)
        })
          //===============EDIT ETUDIANT===============//
          router.post('/Et_Edit',async function (req,res,next){
            var et = await Etudiants.findOne({where:{id:req.body.id}})
            await Etudiants.update({firstName:req.body.name,lastName:req.body.lname,email:req.body.email},{where:{id:req.body.id}})
            
             res.redirect('/Add_et/'+et.teamId)
           })
    //=======ADD NEW USER==========//
    router.post('/Add_User',urlencodedParser,async  function(req, res, next) {
      try{
        var password = generator.generate({
          length: 10,
          numbers: true
      });
      var email=req.body.email
      const mailOptions = {
        from: 'nnours180@gmail.com',
        to: email,
        subject: 'Pssword',
        text: 'Your password in the inventory website is'+password
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
   await TypeUser.findOne({where:{typeu:req.body.typeid}}).then(( async type=>{
    await Users.create({firstName:req.body.nom,lastName:req.body.prenom,email:req.body.email,password:password,typeUserId:type.id})
   }))
        
    res.redirect('Add_User')
      }catch(err){
        next(err)  
      }
      console.log(req.user)});
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
