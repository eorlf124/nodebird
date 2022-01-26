const express = require('express');

const cors = require('cors');
const db = require('./models');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const hpp = require('hpp');
const helnmet = require('helmet');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const postsRouter = require('./routes/posts');
const passportConfig = require('./passport');
const hashtagRouter = require('./routes/hashtag');
const { use } = require('passport');

dotenv.config();
const app = express();
passportConfig();
db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);

// app.all('/*', function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With');
//     next();
// });
if(process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(hpp());
    app.use(helnmet());
} else {
    app.use(morgan('dev'));
}

app.use(cors({
    origin: true,
    credentials: true,
}));

// 첫번째 파라미터 : localhost:3065/imgs/ url로 접근하면 uploads폴더 호출
// join : 현재폴더경로/uploads
app.use('/imgs', express.static(path.join(__dirname, 'uploads')));

// front에서 받은 데이터를 req에 넣어주는 미들웨어
// 최대한 윗줄에 코딩되어야함
app.use(express.json());
// form 데이터를 처리해줌
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET, // 쿠키 해시값에 대한 복호화 키값
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('hello express');
});

app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(3065, () => {
    console.log('서버 실행 중!');
});