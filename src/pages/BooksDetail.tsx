import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Review from '../components/Review'
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";

interface Book {
    id: number;
    categoryName: string;
    title: string;
    author: string;
    publisher: string;
    totalPage: number;
    coverImage: string;
}

export default function BooksDetail() {
    const {bookId} = useParams();
    const [book, setBook] = useState<Book>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        handleBook();
    }, []);

    // 찜하기
    const handleAddToReadingList = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await fetch('/api/v1/user_books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    bookId: book?.id,
                    status: 'TO_READ',
                }),
            });

            if (response.status === 409) {
                alert('이미 등록된 책입니다.');
                return;
            }

            if (!response.ok) {
                throw new Error('찜하기에 실패했습니다.');
            }

            alert('읽고 싶은 책으로 등록되었습니다!');
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleBook = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/books/${bookId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('토론방 정보를 가져오는데 실패했습니다.');
            }
            const data = await response.json();
            console.log(data);
            setBook(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
            <h2 className="fw-bold pt-5 pb-3 mb-4" style={{ borderBottom: '1px solid #dbdbdb' }}>
                책 상세 정보
            </h2>

            <div className={"mb-5"} style={styles.bookBox}>
                <div>
                    <Image src={book?.coverImage ? book.coverImage : `/book_wallpaper.jpg`} style={styles.bookImg} rounded />
                </div>
                <div>
                    <Card style={styles.bookCard}>
                        <Card.Body>
                            <Card.Title>{book?.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                            <Card.Text className={"py-3"}>
                                <b>작가</b>  {book?.author}<br/>
                                <b>출판사</b> {book?.publisher}<br/>
                                <b>카테고리</b>  {book?.categoryName}<br/>
                                <b>총 페이지</b>  {book?.totalPage}<br/>
                            </Card.Text>
                            <div className="d-flex align-items-center gap-2">
                                <button style={{ cursor: 'pointer' }} className="btn btn-outline-dark" onClick={handleAddToReadingList}>
                                    찜하기
                                </button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* 리뷰 */}
            <Review />
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
        alignContent: 'stretch',
        gap:'15px'
    }
}