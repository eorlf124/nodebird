import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const { mainPosts, hasMorePost, loadPostLoading } = useSelector((state) => state.post);
    const { retweetError } = useSelector((state) => state.post);

    useEffect(() => {
        if (retweetError) {
            alert(retweetError);
        }
    }, [retweetError]);

    useEffect(() => {
        function onScroll() {
            //window.scrollY 얼마나 내렸는지
            //document.documentElement.clientHeight 화면에 보이는 높이
            //document.documentElement.scrollHeight 페이지 총 높이
            //scrollY + clientHeight = scrollHeight 공식이 성립됨
            if (window.scrollY + document.documentElement.clientHeight
                 > document.documentElement.scrollHeight - 300) {
                if (hasMorePost && !loadPostLoading) {
                    const lastId = mainPosts[mainPosts.length - 1]?.id;
                    dispatch({
                        type: LOAD_POSTS_REQUEST,
                        lastId,
                    });
                }
            }
        }
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [hasMorePost, loadPostLoading, mainPosts]);

    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </AppLayout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = ''; // 쿠키 가져오기
    if (context.req && cookie) { // 다른 클라이언트와 쿠키공유하는 것을 방지
        axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
        type: LOAD_POSTS_REQUEST,
    });
    //아래 두줄 안적으면 SUCCESS응답 없이 REQUSET에서 끝남
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});

export default Home;