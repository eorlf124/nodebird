import PropTypes from 'prop-types';
import Head from 'next/head'; //Html 헤더 부분 적용 하기위해 사용
import 'antd/dist/antd.css'; //antd css파일 가져옴

import wrapper from '../store/configureStore';

//pages 폴더내 모든 js파일의 부모가 된다
const NodeBird = ({ Component }) => {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>NodeBird</title>
            </Head>
            <Component />
        </>
    );
};

NodeBird.propTypes = {
    Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird);