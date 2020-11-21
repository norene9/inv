var express = require('express');
var router = express.Router();
const { Users } = require('../sequelize');



module.exports = function (passport) {
        router.post('/login' , passport.authenticate('local',{
                    failureRedirect :"/login",
                                successRedirect :"/user",
                                        }));
                                            return router;
                                            };