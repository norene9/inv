var passport = require('passport');

var localStrategy = require('passport-local').Strategy;
const { Users } = require('../sequelize');


module.exports = function (passport) {
     passport.serializeUser(function (user,done) {
        done(null,user);
     });
     passport.deserializeUser(function (user,done) {
         done(null,user);
     });
     passport.use(new localStrategy( async function (username,password,done) {
     console.log(username)
     console.log(password)
      const user = await Users.findOne({where: {
              email:username ,password : password
          }});
      if(user) {
         console.log(user)
          done( null,user);
         
      } else {
        console.log('not found')
          done(null,false);
      }
     }));
};
 
 

  
    
     
  





