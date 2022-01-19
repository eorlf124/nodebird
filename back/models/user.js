const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class User extends Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: DataTypes.STRING(100),
                allowNull: false, // false 필수  true 옵션
                unique: true,
            },
            nickname: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        }, {
            modelName: 'User',
            tableName: 'Users',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',      
            sequelize,
        })
    }
    static associate(db) {
        db.User.hasMany(db.Post);  //User 1 : Post N 관계
        db.User.hasMany(db.Comment); 
        db.User.belongsToMany(db.Post, { through : 'Like', as: 'Liked' }); 
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
    }
};