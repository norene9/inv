module.exports = (sequelize, type) => {
    return sequelize.define('type_users', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
       typeu :type.STRING,
        
    })
};