import { all, fork, put, takeLatest, throttle, call } from 'redux-saga/effects';
import axios from 'axios';
import {
    ADD_POST_FAILURE, ADD_POST_SUCCESS, ADD_POST_REQUEST,
    ADD_COMMENT_SUCCESS, ADD_COMMENT_REQUEST, ADD_COMMENT_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE, LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE, LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE, UNLIKE_POST_REQUEST, UNLIKE_POST_FAILURE, UNLIKE_POST_SUCCESS, UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE, RETWEET_SUCCESS, RETWEET_FAILURE, RETWEET_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE, LOAD_POST_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE, LOAD_USER_POSTS_REQUEST, LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_TO_ME } from '../reducers/user';

function loadPostAPI(data) {
    return axios.get(`/post/${data}`);
}

function* loadPost(action) {
    try {
        const result = yield call(loadPostAPI, action.data);
        yield put({
            type: LOAD_POST_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        //실패 결과는 err.response.data에 담겨있다.
        yield put({
            type: LOAD_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchLoadPost() {
    yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

//saga 파일 쪼갤 때 리듀서랑 비슷하게 쪼개면 됨
function loadPostsAPI(lastId) {
    return axios.get(`/posts?lastId=${lastId || 0}`);
}

function* loadPosts(action) {
    try {
        const result = yield call(loadPostsAPI, action.lastId);
        yield put({
            type: LOAD_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        //실패 결과는 err.response.data에 담겨있다.
        yield put({
            type: LOAD_POSTS_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchLoadPosts() {
    yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function addPostAPI(data) {
    return axios.post('/post', data);
}

function* addPosts(action) {
    console.log('addPost function');
    try {
        //성공 결과는 result.data에 담겨있다.
        const result = yield call(addPostAPI, action.data);
        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data,
        });
        yield put({
            type: ADD_POST_TO_ME,
            data: result.data.id,
        });
    } catch (err) {
        //실패 결과는 err.response.data에 담겨있다.
        yield put({
            type: ADD_POST_FAILURE,
            error: err.response.data,
        });
    }
}

//saga 파일 쪼갤 때 리듀서랑 비슷하게 쪼개면 됨
function LoadUserPostsAPI(data, lastId) {
    return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}

function* LoadUserPosts(action) {
    try {
        const result = yield call(LoadUserPostsAPI, action.data, action.lastId);
        yield put({
            type: LOAD_USER_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        //실패 결과는 err.response.data에 담겨있다.
        yield put({
            type: LOAD_USER_POSTS_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchLoadUserPosts() {
    yield throttle(5000, LOAD_USER_POSTS_REQUEST, LoadUserPosts);
}

//saga 파일 쪼갤 때 리듀서랑 비슷하게 쪼개면 됨
function LoadHashtagPostsAPI(data, lastId) {
    return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}

function* LoadHashtagPosts(action) {
    try {
        const result = yield call(LoadHashtagPostsAPI, action.data, action.lastId);
        yield put({
            type: LOAD_HASHTAG_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        //실패 결과는 err.response.data에 담겨있다.
        yield put({
            type: LOAD_HASHTAG_POSTS_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchLoadHashtagPosts() {
    yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, LoadHashtagPosts);
}

function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPosts);
}

function removePostAPI(data) {
    return axios.delete(`/post/${data}`);
}

function* removePost(action) {
    try {
        //성공 결과는 result.data에 담겨있다.
        const result = yield call(removePostAPI, action.data);
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: result.data,
        });
        yield put({
            type: REMOVE_POST_TO_ME,
            data: result.data,
        });
    } catch (err) {
        //실패 결과는 err.response.data에 담겨있다.
        yield put({
            type: REMOVE_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function addCommentAPI(data) {
    return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
    try {
        //성공 결과는 result.data에 담겨있다.
        const result = yield call(addCommentAPI, action.data);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        //실패 결과는 err.response.data에 담겨있다.
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function likePostAPI(data) {
    return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
    try {
        //성공 결과는 result.data에 담겨있다.
        const result = yield call(likePostAPI, action.data);
        yield put({
            type: LIKE_POST_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        //실패 결과는 err.response.data에 담겨있다.
        yield put({
            type: LIKE_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function unLikePostAPI(data) {
    return axios.delete(`/post/${data}/unlike`);
}

function* unLikePost(action) {
    try {
        //성공 결과는 result.data에 담겨있다.
        const result = yield call(unLikePostAPI, action.data);
        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        //실패 결과는 err.response.data에 담겨있다.
        yield put({
            type: UNLIKE_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchUnLikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unLikePost);
}

function uploadImagesAPI(data) {
    return axios.post('/post/images', data);
}

function* uploadImages(action) {
    try {
        //성공 결과는 result.data에 담겨있다.
        const result = yield call(uploadImagesAPI, action.data);
        yield put({
            type: UPLOAD_IMAGES_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        //실패 결과는 err.response.data에 담겨있다.
        yield put({
            type: UPLOAD_IMAGES_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function retweetAPI(data) {
    return axios.post(`/post/${data}/retweet`);
}

function* retweet(action) {
    try {
        //성공 결과는 result.data에 담겨있다.
        const result = yield call(retweetAPI, action.data);
        yield put({
            type: RETWEET_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        //실패 결과는 err.response.data에 담겨있다.
        yield put({
            type: RETWEET_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchRetweet() {
    yield takeLatest(RETWEET_REQUEST, retweet);
}

export default function* postSaga() {
    yield all([
        fork(watchLoadPost),
        fork(watchRetweet),
        fork(watchUploadImages),
        fork(watchAddPost),
        fork(watchLoadPosts),
        fork(watchLoadUserPosts),
        fork(watchLoadHashtagPosts),
        fork(watchRemovePost),
        fork(watchAddComment),
        fork(watchLikePost),
        fork(watchUnLikePost),
    ]);
}