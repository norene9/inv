const Sequelize = require('sequelize');
const BcModel=require('./models/BComande')
const UserModel  = require('./models/User');
const BLModel  = require('./models/BL');
const ChefsModel  = require('./models/Chef_Group');
const BL_ContentModel  = require('./models/BL_Content');
const ComposantModel  = require('./models/Composant');
const EtudiantModel  = require('./models/Etudiant');
const GroupModel  = require('./models/Group');
const TypeUserModel  = require('./models/Type_User');
const PromoModel  = require('./models/Promo');

const Bc_ConetntModel=require('./models/Bc_content')

const sequelize = new Sequelize('stock', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


const TypeUser = TypeUserModel(sequelize,Sequelize);
const Users = UserModel(sequelize,Sequelize);
const Chefs = ChefsModel(sequelize,Sequelize);
const Bon_Livraison = BLModel(sequelize,Sequelize);
const BL_Content = BL_ContentModel(sequelize,Sequelize);
const Composants = ComposantModel(sequelize,Sequelize);
const Etudiants = EtudiantModel(sequelize,Sequelize);
const Groups = GroupModel(sequelize,Sequelize);
const Promo=PromoModel(sequelize,Sequelize)
const Bc=BcModel(sequelize,Sequelize)
const Bc_Content=Bc_ConetntModel(sequelize,Sequelize)

BL_Content.belongsTo(Composants)
BL_Content.belongsTo(Bon_Livraison)
Composants.hasMany(BL_Content)
Bon_Livraison.hasMany(BL_Content)
Etudiants.belongsTo(Groups)
Groups.hasMany(Etudiants)
Chefs.belongsTo(Etudiants)
Etudiants.belongsTo(Promo)
Chefs.belongsTo(Groups)
Groups.belongsTo(Promo)
//TypeUser.hasMany(Users)
Users.belongsTo(TypeUser)
Bc.belongsTo(Users)
Bc.belongsTo(Groups)
Bc.belongsTo(Promo)
Bc_Content.belongsTo(Composants)
Bc_Content.belongsTo(Bc)

sequelize.sync({ force:false })
    .then(() => {
        console.log(" database init")
    });
 

module.exports = {
    TypeUser, Users,Bon_Livraison,Chefs,Composants,Etudiants,Groups,BL_Content,Bc,Bc_Content,Promo
};
