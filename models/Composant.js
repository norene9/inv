
module.exports = (sequelize, type) => {
    return sequelize.define('composants', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name :type.STRING,
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
