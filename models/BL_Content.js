
module.exports = (sequelize, type) => {
    return sequelize.define('bl_content', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cquantity:{type:type.INTEGER,
        dfaultValue:'0',}
       
    })
};