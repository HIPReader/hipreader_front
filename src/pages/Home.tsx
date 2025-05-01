import Container from 'react-bootstrap/Container';
import YearlyBestBook from "../components/YearlyBestBook";
import ReadingBooks from "../components/ReadingBooks"
import BookRecommendation from "../components/BookRecommendation";

export default function Home() {
    return (
        <Container>
            <div className="hero-section" style={{
                position: 'relative',
                height: '400px',
                backgroundImage: 'url("/book_wallpaper.jpg")',  // 배경 이미지 경로는 실제 파일명으로 변경
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
            }}>
                {/* 어두운 반투명 오버레이 */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1,
                }}></div>

                {/* 콘텐츠 영역 */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                }}>
                    <img src="/logo2.png" style={{width:'500px'}} alt=""/>
                    <p style={{
                        fontSize: '1.5rem',
                        textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
                    }}>
                        기록하고 소통하자<br />우리가 리드하는 <b>HIP-Reader</b>
                    </p>
                </div>
            </div>

            {/* 올해의 책 */}
            <YearlyBestBook/>

            {/* 책 추천 */}
            <BookRecommendation/>

            {/* 읽는 책 */}
            <ReadingBooks/>
        </Container>
    );
}

const styles = {
    title: {
        fontSize: '32px',
        lineHeight: '40px'
    },
    subtitle: {
        fontSize: '20px',
        lineHeight: '19px'
    },
    wallpaper: {
        backgroundImage: 'url("/book_wallpaper.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        padding: '20px 30px',
    },
    bigLogo: {
        height: '300px',
        objectFit: 'contain' as const,
    },
    description: {
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        lineHeight: '1.5',
    },
    section: {
        border: '1px solid #000',
        padding: '40px',
        margin: '16px',
        textAlign: 'center' as const,
        backgroundColor: '#fdfdfd',
    },
};