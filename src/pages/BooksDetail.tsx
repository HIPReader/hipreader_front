import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Review from '../components/Review';

interface BookDetail {
  id: number;
  categoryName: string;
  title: string;
  author: string;
  publisher: string;
  coverImage: string;
}

export default function BooksDetail() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);

  useEffect(() => {
    fetch(`/api/v1/books/${id}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error('책 정보 불러오기 실패', err));
  }, [id]);

  if (!book) return <div>로딩 중...</div>;

  return (
    <Container>
      <div className={"mb-5"} style={styles.bookBox}>
        <div>
            <Image src={book.coverImage} style={styles.bookImg} rounded />
        </div>
        <div>
          <Card style={styles.bookCard}>
            <Card.Body>
              <Card.Title>{book.title}</Card.Title>
              <Card.Text className={"py-3"}>
                <b>작가</b>  {book.author}<br/>
                <b>출판사</b>  {book.publisher}<br/>
                <b>카테고리</b>  {book.categoryName}<br/>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/*<Review />*/}
    </Container>
  );
}

const styles = {
  bookImg: {
    width: '205px',
    height: '295px',
    objectFit: 'cover' as 'cover' | 'contain' | 'fill'
  },
  bookCard: {
    border: 'none'
  },
  bookBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  }
};
