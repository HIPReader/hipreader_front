import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';

interface ReadingBook {
    userBookId: number;
    bookId: number;
    title: string;
    author: string;
    categoryName: string;
    coverImage: string;
    percentage: number;
}

export default function ReadingBooks() {
    const [readingBooks, setReadingBooks] = useState<ReadingBook[]>([]);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        fetch('/api/v1/user_books/my/reading', {
            headers: {Authorization: `Bearer ${accessToken}`}
        })
            .then(res => res.json())
            .then(data => {
                setReadingBooks(data.content || []);
            })
            .catch(err => {
                console.error('읽고 있는 책 불러오기 실패', err);
            });
    }, []);

    return (
        <div className={"py-5"}>
            <h2 className="fw-bold py-3">읽고 있는 책</h2>

            <Row>
                {readingBooks.map((book) => (
                    <Col key={book.userBookId} className={"mb-3"}>
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
                                        {book.categoryName}
                                    </Card.Text>
                                    <ProgressBar variant={"dark"} now={book.percentage} />
                                </Card.Body>
                            </Link>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
