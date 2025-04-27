import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';

interface Book {
    id: number;
    title: string;
    author: string;
    categoryName: string;
}

export default function BookRecommendation() {
    const [age, setAge] = useState<number>(20);
    const [gender, setGender] = useState<string>('MALE');
    const [categoryName, setCategoryName] = useState<string>('일반');
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
                                placeholder="예) 로맨스, 추리, 판타지"
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
            <Row className="g-4 mt-3">
                {books.map((book) => (
                    <Col key={book.id} md={4} lg={3}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title className="fw-bold">{book.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{book.author}</Card.Subtitle>
                                <Card.Text>
                                    카테고리: {book.categoryName}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
