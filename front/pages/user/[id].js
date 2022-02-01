//post/[id].js
import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import { END } from 'redux-saga';
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card } from "antd";
import Head from 'next/head'; //Html 헤더 부분 적용 하기위해 사용

import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../../reducers/user";
import { LOAD_USER_POSTS_REQUEST } from "../../reducers/post";
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import { backUrl } from "../../config/config";

const User = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;
    const { mainPosts, hasMorePost, loadPostLoading } = useSelector((state) => state.post);
    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY + document.documentElement.clientHeight
                > document.documentElement.scrollHeight - 300) {
               if (hasMorePost && !loadPostLoading) {
                   const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id;
                   dispatch({
                       type: LOAD_USER_POSTS_REQUEST,
                       lastId,
                       data: id,
                   });
               }
           }
        };
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [hasMorePost, mainPosts.length, id]);

    return (
        <AppLayout>
            {userInfo && (
                <Head>
                    <title>
                        {userInfo.nickname} 님의 글
                    </title>
                    <meta name="description" content={`${userInfo.nickname}님의 게시글`} />
                    <meta property="og:title" content={`${userInfo.nickname}님의 게시글`} />
                    <meta property="og:description" content={`${userInfo.nickname}님의 게시글`} />
                    <meta property="og:image" content={`${backUrl}/favicon.ico`} />
                </Head>
            )}
            {userInfo
                ? (
                    <Card
                        style={{ marginBottom: 20, marginTop: 20 }}
                        actions={[
                        <div key="twit">
                            짹짹
                            <br />
                            {userInfo.Posts.length}
                        </div>,
                        <div key="following">
                            팔로잉
                            <br />
                            {userInfo.Followings.length}
                        </div>,
                        <div key="follower">
                            팔로워
                            <br />
                            {userInfo.Followers.length}
                        </div>,
                        ]}
                    >
                        <Card.Meta
                            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                            title={userInfo.nickname}
                        />
                    </Card>
                ) : null }
            {mainPosts.map((c) => (
                <PostCard key={c.id} post={c} />
            ))}
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
        type: LOAD_USER_POSTS_REQUEST,
        data: context.params.id,
    });
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: context.params.id,
    });
    //아래 두줄 안적으면 SUCCESS응답 없이 REQUSET에서 끝남
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
    //console.log('getState', context.store.getState().post.mainPosts);
    return { props: {} };
});

export default User;