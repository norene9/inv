
module.exports = (sequelize, type) => {
    return sequelize.define('etudiants', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName :type.STRING,
        lastName :type.STRING,
        email: type.STRING
    })
};
