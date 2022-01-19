const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Post extends Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        }, {
            modelName: 'Post',
            tableName: 'Posts',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',      
            sequelize,
        })
    }
    static associate(db) {
        db.Post.belongsTo(db.User); // User FK 컬럼 생김 ( UserId )
        db.Post.hasMany(db.Comment); 
        db.Post.hasMany(db.Image); 
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag'}); // N : N 관계
        db.Post.belongsToMany(db.User, { through : 'Like', as: 'Likers' });  //through  N:N 테이블 이름 정하기
        db.Post.belongsTo(db.Post, { as: 'Retweet' }); // 계층 구조
    }
};