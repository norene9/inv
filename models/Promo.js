module.exports = (sequelize, type) => {
    return sequelize.define('promo', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        promo :type.STRING,
        
    })
};