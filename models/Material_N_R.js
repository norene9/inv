
module.exports = (sequelize, type) => {
    return sequelize.define('Nretourne', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity:{type:type.INTEGER,
        dfaultValue:'0',}
       
    })
};