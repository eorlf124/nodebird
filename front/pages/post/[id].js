//post/[id].js
import React from "react";
import axios from "axios";
import { END } from 'redux-saga';
import { useSelector } from "react-redux";

import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_POST_REQUEST } from "../../reducers/post";
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

const Post = () => {
    // const router = useRouter();
    // const { id } = router.query;
    const { singlePost } = useSelector((state) => state.post);

    return (
        <AppLayout>
            <PostCard post={singlePost} />
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
        type: LOAD_POST_REQUEST,
        data: context.params.id,
    });
    //아래 두줄 안적으면 SUCCESS응답 없이 REQUSET에서 끝남
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});

export default Post;