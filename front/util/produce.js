import { enableES5, produce } from 'immer';

//IE11에서도 immer를 사용할 수 있도록
export default (...args) => {
    enableES5();
    return produce(...args);
};