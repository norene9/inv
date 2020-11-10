const Sequelize = require('sequelize');

const UserModel  = require('./models/User');
const BLModel  = require('./models/BL');
const ChefsModel  = require('./models/Chef_Group');
const BL_ContentModel  = require('./models/BL_Content');
const ComposantModel  = require('./models/Composant');
const EtudiantModel  = require('./models/Etudiant');
const GroupModel  = require('./models/Group');
const TypeModel  = require('./models/Type_User');
const sequelize = new Sequelize('stock', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});



const Users = UserModel(sequelize,Sequelize);
const Chefs = ChefsModel(sequelize,Sequelize);
const BL = BLModel(sequelize,Sequelize);
const BL_Content = BL_ContentModel(sequelize,Sequelize);
const Composants = ComposantModel(sequelize,Sequelize);
const Etudiants = EtudiantModel(sequelize,Sequelize);
const Groups = GroupModel(sequelize,Sequelize);

BL_Content.belongsTo(Composants)
BL_Content.belongsTo(BL)
Composants.hasMany(BL_Content)
BL.hasMany(BL_Content)
Etudiants.belongsTo(Groups)
Groups.hasMany(Etudiants)
Chefs.belongsTo(Etudiants)
Chefs.belongsTo(Groups)
sequelize.sync({ force: false })
    .then(() => {
        console.log(" database init")
    });
 

module.exports = {
   Users,Chefs,Composants,Etudiants,Groups,BL_Content,BL
};
