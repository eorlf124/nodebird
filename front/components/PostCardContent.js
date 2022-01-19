import PropTyes from 'prop-types';
import Link from 'next/link';

const PostCardContent = ({ postData }) => (

    <div>
        {postData.split(/(#[^\s#]+)/g).map((v, i) => {
            //split 사용시 정규표현식 잘 안먹을수 있음 ()로 감싸기

            if (v.match(/(#[^\s#]+)/)) {
                //slice는 # 빼고 그 뒤의 문자만 링크 걸도록
                return <Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link>;
            }

            return v;
        })}
    </div>
);

PostCardContent.propTypes = {
    postData: PropTyes.string.isRequired,
};

export default PostCardContent;
