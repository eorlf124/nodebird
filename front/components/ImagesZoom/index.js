import PropTypes from 'prop-types';
import { useState } from 'react';
import Slick from 'react-slick';
import { backUrl } from '../../config/config';
import { Overlay, Global, Header, CloseBtn, ImgWrapper, SlickWrapper, Indicator } from './styles';

const ImagesZoom = ({ images, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <Overlay>
            <Global />
            <Header>
                <h1>상세 이미지</h1>
                <CloseBtn onClick={onClose}>X</CloseBtn>
            </Header>
            <SlickWrapper>
                <div>
                    <Slick
                        initialSlide={0} //첫 번째 이미지 설정
                        afterChange={(slide) => setCurrentSlide(slide)} //현재 슬라이드 번호를 state에 저장
                        infinite //마지막 이미지에서 뒤로 가면 첫번째 이미지로 돌아오도록
                        arrows={false} //화살표 버튼 사용할건지?
                        slidesToShow={1}
                        slidesToScroll={1}
                    >
                        {images.map((v) => (
                            <ImgWrapper key={v.src}>
                                <img src={`${v.src}`} alt={v.src} />
                            </ImgWrapper>
                        ))}
                    </Slick>
                    <Indicator>
                        <div>
                            {currentSlide + 1}
                            {' '}
                            /
                            {images.length}
                        </div>
                    </Indicator>
                </div>
            </SlickWrapper>
        </Overlay>
    );
};

ImagesZoom.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;