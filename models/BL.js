
module.exports = (sequelize, type) => {
    return sequelize.define('bls', {

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numero: type.INTEGER,
        date : type.DATE
    })
};
