const sequelize = require("../sequelize");

module.exports=(sequelize,type)=>{
    return sequelize.define('bc',{
        id:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        etat:type.STRING,
        Titre:type.STRING

    })
}