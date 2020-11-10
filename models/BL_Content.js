
module.exports = (sequelize, type) => {
    return sequelize.define('bl_content', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: type.INTEGER,
       
    })
};