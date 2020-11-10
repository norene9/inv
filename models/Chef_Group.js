
module.exports = (sequelize, type) => {
    return sequelize.define('chefs', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
    })
};
