//saga의 임팩트
import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';
import { backUrl } from '../config/config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

// function* : 제너레이터 함수
// yield; : 함수가 해당 코드에서 멈춤
// all : 배열 안의 값을 실행한다.
// fork : 함수를 실행한다. (비동기 함수 호출)
// call : 함수를 실행한다. (동기 함수 호출)
// put : redux의 dispatch와 같다.
// take : 해당 action이 호출될 때 까지 기다리다 지정된 제너레이터 함수를 호출해준다..
// js에서 무한 반복문 표현하려고 할 때 주로 사용
export default function* rootSaga() {
    yield all([
        fork(postSaga),
        fork(userSaga),
    ]);
}