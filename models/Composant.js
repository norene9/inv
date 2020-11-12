
module.exports = (sequelize, type) => {
    return sequelize.define('composants', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name :{type:type.STRING,
            unique: true
        },
        quantity: {
            type:type.INTEGER,
            dfaultValue:'0',
        } ,
        quantity_dispo: {
            type:type.INTEGER,
            dfaultValue:'0',
        
        }
    })
};
