const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User, Post, Image, Comment } = require('../models')
const { Op } = require('sequelize');

/**
 * 로그인 사용자 정보 불러오기
 */
router.get('/', async (req, res, next) => {
    console.log(req.headers);
    try {
        if(req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id },
                attributes: {
                    exclude: ['password'], //password 컬럼 제외하고 조회
                },
                include: [{ // 테이블 join
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],                    
                }],
            });
            res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }
    } catch (error){
        console.error(error);
        next(error);
    }
});

/**
 * 회원가입
 */
// async .. await 동기식으로 사용
// 응답 두번보내면 무조건 에러발생
router.post('/', isNotLoggedIn, async (req, res, next) => {
    console.log('user 호출됨');
    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        });

        if(exUser) {
            return res.status(403).send('이미 사용중인 아이디 입니다.');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        res.status(200).send('ok');
    } catch (err) {
        console.log(err);
        next(err); // 브라우저에 에러메시지 뿌려줌
    }

});

/**
 * 로그인
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.reason);
        }
        try {

        } catch (err) {
            console.log(err);
            next(err); // 브라우저에 에러메시지 뿌려줌
        }
        //req.login : index의 passport.serializeUser 호출)
        return req.login(user, async (loginErr) => {
            if(loginErr) {
                console.error("passport Error " + loginErr);
                return next("passport Error " + loginErr);
            }
            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id },
                attributes: {
                    exclude: ['password'], //password 컬럼 제외하고 조회
                },
                include: [{ // 테이블 join
                    model: Post,
                }, {
                    model: User,
                    as: 'Followings',
                }, {
                    model: User,
                    as: 'Followers',                    
                }],
            });
            return res.status(200).json(fullUserWithoutPassword);
        });
    })(req, res, next);
});

/**
 * 로그아웃
 */
router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
});

/**
 * 닉네임 변경
 */
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        await User.update({
            nickname: req.body.nickname,
        }, {
            where: { id: req.user.id },
        });
        res.status(200).json({ nickname: req.body.nickname });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/followers', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (!user) {
            res.status(403).send('사용자가 존재하지 않습니다.');
        }
        const followers = await user.getFollowers({
            limit: parseInt(req.query.limit, 10),
        });
        res.status(200).json(followers);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/followings', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (!user) {
            res.status(403).send('사용자가 존재하지 않습니다.');
        }
        const followings = await user.getFollowings({
            limit: parseInt(req.query.limit, 10),
        });
        res.status(200).json(followings);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/**
 * 팔로우
 */
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            res.status(403).send('사용자가 존재하지 않습니다.');
        }
        await user.addFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/**
 * 언팔로우
 */
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            res.status(403).send('사용자가 존재하지 않습니다.');
        }
        await user.removeFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            res.status(403).send('사용자가 존재하지 않습니다.');
        }
        const followers = await user.removeFollowings(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/**
 * 특정 사용자의 게시글 불러오기
 */
router.get('/:userId/posts', async (req, res, next) => {
    try {
        const where = { UserId: req.params.userId };
        if (parseInt(req.query.lastId, 10)) {
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10)};
        }
        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC'],
            ],
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id'],               
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }],
        });
        res.status(200).json(posts);
    } catch(error) {
        console.log(error);
        next(error);
    }
});

/**
 * 사용자 정보 불러오기
 * 와일드카드(:userId)가 들어간 url 호출은 소스 마지막에 넣어야함 
 * 위로 올리면 다른 url 호출들이 여기서 걸림
 */
router.get('/:userId', async (req, res, next) => {
    try {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.params.userId },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      });
      if (fullUserWithoutPassword) {
        res.status(200).json(fullUserWithoutPassword);
      } else {
        res.status(404).json('존재하지 않는 사용자입니다.');
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
});
 
module.exports = router;