const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({
                where: { email }
            });
            if(!exUser) {
                //done(에러, 리턴 데이터, 클라이언트 에러)
                return done(null, false, { reason: '존재하지 않는 사용자입니다.' });
            }
            const result = await bcrypt.compare(password, exUser.password);
            if(result) {
                return done(null, exUser);
            }
            return done(null, false, { reason: '비밀번호가 일치하지 않습니다.' });
        } catch (error) {
            console.error(error);
            return done(error);
        }
    }));
}