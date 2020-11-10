
module.exports = (sequelize, type) => {
    return sequelize.define('groups', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        promo :type.STRING,
        numero : type.INTEGER
    })
};
