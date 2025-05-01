import React, { useEffect, useState } from 'react';
import Card from "react-bootstrap/Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";

type BookInfo = {
    bookId: number;
    title: string;
    author: string;
    publisher: string;
    totalScore: number;
    categoryName: string;
    coverImage: string;
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

    return (
        <div className="py-5">
            <h2 className="fw-bold py-3">올해의 책</h2>
            <Row>
                {topBooks.map((book, idx) => (
                    <Col key={book.bookId} className={"mb-3"}>
                        <div style={{ width: '10rem' }}>
                            <Link to={`/books/${book.bookId}`} style={{ color: 'black', textDecoration: 'none' }}>
                                <Card.Img style={{width:'180px', height:'260px'}} variant="top" src={book.coverImage || "/book_wallpaper.jpg"} />
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
                                        {book.categoryName}<br/>
                                        점수: {book.totalScore}
                                    </Card.Text>
                                </Card.Body>
                            </Link>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
