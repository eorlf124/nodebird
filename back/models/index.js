const Sequelize = require('sequelize');
const commnet = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = user;
db.Post = post;
db.Comment = commnet;
db.Hashtag = hashtag;
db.Image = image;


// 반복문 돌면서 모델 초기화
Object.keys(db).forEach(modelName => { 
  db[modelName].init(sequelize);
})

//db 객체에 등록한 모델 루프 돌면서 FK관계 연결
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
