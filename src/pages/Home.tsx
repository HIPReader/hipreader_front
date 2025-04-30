import Container from 'react-bootstrap/Container';
import YearlyBestBook from "../components/YearlyBestBook";
import ReadingBooks from "../components/ReadingBooks"
import BookRecommendation from "../components/BookRecommendation";

export default function Home() {
  return (
    <Container>
      {/* 배경 이미지 섹션 */}
      <div style={styles.wallpaper}>
        <div style={styles.overlay}>
          <img src="/logo.png" alt="로고" style={styles.bigLogo} />
          <p style={styles.description}>
          기록하고 소통하자 우리가 리드하는 HIP-Reader
          </p>
        </div>
      </div>

      {/* 올해의 책 */}
      <YearlyBestBook/>

      {/* 책 추천 */}
      <BookRecommendation />

      {/* 읽는 책 */}
      <ReadingBooks/>
    </Container>
  );
}

const styles = {
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