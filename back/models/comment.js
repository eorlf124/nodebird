const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        }, {
            modelName: 'Comment',
            tableName: 'Comments',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',      
            sequelize,
        })
    }
    static associate(db) {
        db.Comment.belongsTo(db.User); //FK 연결
        db.Comment.belongsTo(db.Post);
    }
};