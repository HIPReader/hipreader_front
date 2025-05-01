import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

interface Book {
    id: number;
    bookId: number;
    title: string;
    author: string;
    categoryName: string;
    coverImage: string | null;
}

export default function BookRecommendation() {
    const [age, setAge] = useState<number>(20);
    const [gender, setGender] = useState<string>('FEMALE');
    const [categoryName, setCategoryName] = useState<string>('인문');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleRecommend = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/v3/books/recommend?age=${age}&gender=${gender}&categoryName=${categoryName}`);
            if (!response.ok) {
                throw new Error('추천 정보를 가져오는 데 실패했습니다.');
            }
            const data = await response.json();
            setBooks(data.content);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">책 추천</h2>

            {/* 필터 폼 */}
            <Form className="mb-4">
                <Row className="g-2">
                    <Col md={3}>
                        <Form.Group controlId="ageSelect">
                            <Form.Label>나이</Form.Label>
                            <Form.Select value={age} onChange={(e) => setAge(Number(e.target.value))}>
                                <option value={10}>10대</option>
                                <option value={20}>20대</option>
                                <option value={30}>30대</option>
                                <option value={40}>40대</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="genderSelect">
                            <Form.Label>성별</Form.Label>
                            <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="MALE">남성</option>
                                <option value="FEMALE">여성</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="categorySelect">
                            <Form.Label>카테고리</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="예) 인문, 소설"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                        <Button variant="dark" className="w-100" onClick={handleRecommend}>
                            추천
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* 로딩 중 스피너 */}
            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="dark" />
                </div>
            )}

            {/* 에러 메시지 */}
            {error && (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            )}

            {/* 추천 결과 */}
            <Row className="mt-3">
                <Swiper
                    spaceBetween={20} // 카드 간 간격
                    slidesPerView="auto" // 카드가 가로로 여러 개 보이게
                    loop={false} // 끝까지 가면 다시 처음으로 돌아옴
                    breakpoints={{
                        576: {
                            slidesPerView: 1, // 모바일에서는 한 개씩
                        },
                        768: {
                            slidesPerView: 2, // 태블릿 이상에서는 2개씩
                        },
                        992: {
                            slidesPerView: 3, // 더 큰 화면에서는 3개씩
                        },
                    }}
                >
                    {books.map((book) => (
                        <SwiperSlide key={book.bookId} style={{ width: 'auto', margin: '0 10px' }}>
                            <div style={{ width: '10rem' }}>
                                <Link to={`/books/${book.bookId}`} style={{ color: 'black', textDecoration: 'none' }}>
                                    <Card.Img style={{width:'180px', height:'260px'}} variant="top" src={book.coverImage ?? "/book_wallpaper.jpg"} />
                                    <Card.Body className={"mt-2"}>
                                        <Card.Title
                                            style={{
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {book.title}
                                        </Card.Title>
                                        <Card.Text>
                                            <span
                                                style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {book.author}
                                            </span><br/>
                                            {book.categoryName}
                                        </Card.Text>
                                    </Card.Body>
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Row>
        </div>
    );
}
