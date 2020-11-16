const sequelize = require("../sequelize");

module.exports=(sequelize,type)=>{
   return sequelize.define('b_content',{
        id:{
            type:type.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        quantity:type.STRING
    })
}