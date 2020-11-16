var crypto= require('crypto');
var passport =require('passport') 
var LocalStrategy=require('passport-local').Strategy;
var { Users } = require('../sequelize');
const {TypeUser} = require('../sequelize');
const router = require('./general');
const session = require('express-session')
passport.serializeUser((user, done) => {
  console.log('serializing user: ', user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Users.findById(id).then((user) => {
    done(null, user);
  }).catch(done);
});
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
      token = req.cookies["access_token"];
  }
  return token;
};
passport.use(new LocalStrategy(
    { // or whatever you want to use
        usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
        passwordField: 'password'
      },
    async function(username, password, done) {
      await Users.findOne({where:{ email: username }}).then(user=>{
        console.log(user)
if (!user) {return done(null, false, { message: 'Incorrect username.' });}
        if(user.password!==password){
          console.log(user.password)
          return done(null,false,{message:'incorrect pass'})}
        return done(null,user)
      })
    }
  ));
 
  router.get('/login', async function(req,res,next){
    
    res.render('login')
   
})

  
    
     
  

router.post('/login',function(req,res,next){
    passport.authenticate('local',function(err,user,info){
        if(err){return next(err)}
        if(!user){return res.json({status:'error',message:info.message});
    }
    req.logIn(user,function(err){
        if(err){return next(err);}
        //return res.json({status:'ok'});
        console.log(req.user)
        
        res.redirect('/user/'+req.user.id)
    });
    })(req,res,next)
})
router.get('/logout',function(req,res){
    req.logOut();
    res.redirect('/')
})


module.exports = router;
/*module.exports=function(app,passport){
  return router
}*/