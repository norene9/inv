module.exports = (sequelize, type) => {
    return sequelize.define('type_user', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
       type :type.STRING,
        
    })
};