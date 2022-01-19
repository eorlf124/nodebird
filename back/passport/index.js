const passport = require('passport');
const { User } = require('../models');
const local = require('./local');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // 쿠키 생성 후 id 매핑
    });

    passport.deserializeUser(async (id, done) => {
        try{
            const user = await User.findOne({ where: { id }});
            done(null, user);
        } catch (error){
            console.error(error);
            done(error);
        }
    });

    local();
};