import React, { useEffect, useState } from 'react';
import Card from "react-bootstrap/Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type BookInfo = {
    title: string;
    author: string;
    publisher: string;
    totalScore: number;
};


export default function YearlyBestBook() {
    const [topBooks, setTopBooks] = useState<BookInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const currentYear = new Date().getFullYear();

        fetch(`/api/v1/books/of-the-year/${currentYear}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('서버 오류가 발생했습니다');
                }
                return response.json();
            })
            .then(data => {
                setTopBooks(data.topBooks || []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;
    if (topBooks.length === 0) return <div>올해의 책이 아직 없습니다</div>;

    return (
        <div className="py-5">
            <h2 className="fw-bold py-3">올해의 책</h2>
            <Row>
                {topBooks.map((book, idx) => (
                    <Col key={idx}>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src="/book_wallpaper.jpg" />
                            <Card.Body>
                                <Card.Title>{book.title}</Card.Title>
                                <Card.Text>
                                    {book.author}<br />
                                    {book.publisher}<br />
                                    점수: {book.totalScore}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
