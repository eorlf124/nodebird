import produce from '../util/produce';

export const initialState = {
    loadUserLoading: false,
    loadUserDone: false,
    loadUserError: null,
    loadMyInfoLoading: false,
    loadMyInfoDone: false,
    loadMyInfoError: null,
    followLoading: false,
    followDone: false,
    followError: null,
    unfollowLoading: false,
    unfollowDone: false,
    unfollowError: null,
    loginLoading: false, //로그인 시도중
    loginDone: false,
    loginError: null,
    logoutLoading: false, //로그아웃 시도중
    logoutDone: false,
    logoutError: null,
    signupLoading: false, //회원가입 시도중
    signupDone: false,
    signupError: null,
    changeNicknameLoading: false, //닉네임 변경 시도중
    changeNicknameDone: false,
    changeNicknameError: null,
    loadFollowersLoading: false,
    loadFollowersDone: false,
    loadFollowersError: null,
    loadFollowingsLoading: false,
    loadFollowingsDone: false,
    loadFollowingsError: null,
    removeFollowerLoading: false,
    removeFollowerDone: false,
    removeFollowerError: null,
    me: null,
    userInfo: null,
    signUpdata: {},
    loginData: {},
};

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_TO_ME = 'REMOVE_POST_TO_ME';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

// const dummyUser = (data) => ({
//     ...data,
//     nickname: '제로초',
//     id: 1,
//     Posts: [{ id: '1' }],
//     Followings: [{ nickname: '부기초' }, { nickname: '정찰기' }, { nickname: '김시발' }],
//     Followers: [{ nickname: '부기초' }, { nickname: '정찰기' }, { nickname: '김시발' }],
// });

export const loginRequestAction = (data) => {
    return {
        type: LOG_IN_REQUEST,
        data,
    };
};

export const logoutRequestAction = () => {
    return {
        type: LOG_OUT_REQUEST,
    };
};

// => 뒤에 붙는 함수는 return이 생략된 것
const reducer = (state = initialState, action) => produce(state, (draft) => {
    switch (action.type) {
        case LOAD_USER_REQUEST:
            draft.loadUserLoading = true;
            draft.loadUserError = null;
            draft.loadUserDone = false;
            break;
        case LOAD_USER_SUCCESS:
            draft.loadUserLoading = false;
            draft.userInfo = action.data;
            draft.loadUserDone = true;
            break;
        case LOAD_USER_FAILURE:
            draft.loadUserLoading = false;
            draft.loadUserError = action.error;
            break;
        case LOAD_MY_INFO_REQUEST:
            draft.loadMyInfoLoading = true;
            draft.loadMyInfoError = null;
            draft.loadMyInfoDone = false;
            break;
        case LOAD_MY_INFO_SUCCESS:
            draft.loadMyInfoLoading = false;
            draft.me = action.data;
            draft.loadMyInfoDone = true;
            break;
        case LOAD_MY_INFO_FAILURE:
            draft.loadMyInfoLoading = false;
            draft.loadMyInfoError = action.error;
            break;
        case FOLLOW_REQUEST:
            draft.followLoading = true;
            draft.followError = null;
            draft.followDone = false;
            break;
        case FOLLOW_SUCCESS:
            draft.followLoading = false;
            draft.followDone = true;
            draft.me.Followings.push({ id: action.data.UserId });
            break;
        case FOLLOW_FAILURE:
            draft.followLoading = false;
            draft.followError = action.error;
            break;
        case UNFOLLOW_REQUEST:
            draft.unfollowLoading = true;
            draft.unfollowError = null;
            draft.unfollowDone = false;
            break;
        case UNFOLLOW_SUCCESS:
            draft.unfollowLoading = false;
            draft.unfollowDone = true;
            draft.me.Followings = draft.me.Followings.filter((v) => v.id !== action.data.UserId);
            break;
        case UNFOLLOW_FAILURE:
            draft.unfollowLoading = false;
            draft.unfollowError = action.error;
            break;
        case LOG_IN_REQUEST:
            draft.loginLoading = true;
            draft.loginError = null;
            draft.loginDone = false;
            break;
        case LOG_IN_SUCCESS:
            draft.loginLoading = false;
            draft.loginDone = true;
            draft.me = action.data;
            break;
        case LOG_IN_FAILURE:
            draft.loginLoading = false;
            draft.loginError = action.error;
            break;
        case LOG_OUT_REQUEST:
            draft.logoutLoading = true;
            draft.logoutDone = false;
            draft.logoutError = null;
            break;
        case LOG_OUT_SUCCESS:
            draft.logoutLoading = false;
            draft.logoutDone = true;
            draft.me = null;
            break;
        case LOG_OUT_FAILURE:
            draft.logoutLoading = false;
            draft.logoutError = action.error;
            break;
        case SIGN_UP_REQUEST:
            draft.signupLoading = true;
            draft.signupDone = false;
            draft.signupError = null;
            break;
        case SIGN_UP_SUCCESS:
            draft.signupLoading = false;
            draft.signupDone = true;
            break;
        case SIGN_UP_FAILURE:
            draft.signupLoading = false;
            draft.signupError = action.error;
            break;
        case CHANGE_NICKNAME_REQUEST:
            draft.changeNicknameLoading = true;
            draft.changeNicknameDone = false;
            draft.changeNicknameError = null;
            break;
        case CHANGE_NICKNAME_SUCCESS:
            draft.me.nickname = action.data.nickname;
            draft.changeNicknameLoading = false;
            draft.changeNicknameDone = true;
            break;
        case CHANGE_NICKNAME_FAILURE:
            draft.changeNicknameLoading = false;
            draft.changeNicknameError = action.error;
            break;
        case LOAD_FOLLOWERS_REQUEST:
            draft.loadFollowersLoading = true;
            draft.loadFollowersError = null;
            draft.loadFollowersDone = false;
            break;
        case LOAD_FOLLOWERS_SUCCESS:
            draft.loadFollowersLoading = false;
            draft.loadFollowersDone = true;
            draft.me.Followers = action.data;
            break;
        case LOAD_FOLLOWERS_FAILURE:
            draft.loadFollowersLoading = false;
            draft.loadFollowersError = action.error;
            break;
        case LOAD_FOLLOWINGS_REQUEST:
            draft.loadFollowingsLoading = true;
            draft.loadFollowingsError = null;
            draft.loadFollowingsDone = false;
            break;
        case LOAD_FOLLOWINGS_SUCCESS:
            draft.loadFollowingsLoading = false;
            draft.loadFollowingsDone = true;
            draft.me.Followings = action.data;
            break;
        case LOAD_FOLLOWINGS_FAILURE:
            draft.loadFollowingsLoading = false;
            draft.loadFollowingsError = action.error;
            break;
        case REMOVE_FOLLOWER_REQUEST:
            draft.removeFollowerLoading = true;
            draft.removeFollowerError = null;
            draft.removeFollowerDone = false;
            break;
        case REMOVE_FOLLOWER_SUCCESS:
            draft.removeFollowerLoading = false;
            draft.removeFollowerDone = true;
            draft.me.Followers = draft.me.Followers.filter((v) => v.id !== action.data.UserId);
            break;
        case REMOVE_FOLLOWER_FAILURE:
            draft.removeFollowerLoading = false;
            draft.removeFollowerError = action.error;
            break;
        case ADD_POST_TO_ME:
            draft.me.Posts.unshift({ id: action.data });
            break;
            // return {
            //     ...state,
            //     me: {
            //         ...state.me,
            //         Posts: [{ id: action.data }, ...state.me.Posts],
            //     },
            // };
        case REMOVE_POST_TO_ME:
            draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.data.PostId);
            break;
            // return {
            //     ...state,
            //     me: {
            //         ...state.me,
            //         Posts: state.me.Posts.filter((v) => v.id !== action.data),
            //     },
            // };
        default:
            break;
    }
});

export default reducer;