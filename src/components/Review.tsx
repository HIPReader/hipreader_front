import React, { useState } from 'react';
import { Card, Button, Form, ListGroup, Col, Row, Image } from 'react-bootstrap';

interface Review {
    name: string;
    profileImage: string;
    text: string;
}

const ReviewForm = () => {
    // 리뷰 데이터 상태 (유저 닉네임, 프로필 이미지, 텍스트)
    const [reviews, setReviews] = useState<Review[]>([]);
    const [name, setName] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [text, setText] = useState('');

    // 리뷰 제출 함수
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 새로운 리뷰 객체 생성
        const newReview = {
            name,
            profileImage,
            text,
        };

        // 기존 리뷰 리스트에 추가
        setReviews([...reviews, newReview]);

        // 폼 초기화
        setName('');
        setProfileImage('');
        setText('');
    };

    return (
        <div>
            {/* 리뷰 작성 폼 */}
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title className={"mb-3"}>리뷰 작성</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Image src="/book_wallpaper.jpg" style={styles.profileImg} roundedCircle />
                            <Form.Label>이지은</Form.Label>
                        </Form.Group>

                        <Form.Group controlId="formReviewText" className="mt-3">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write your review here"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="dark" type="submit" className="mt-3">
                            등록
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* 리뷰 리스트 */}
            <Card>
                <Card.Body>
                    <Card.Title>전체 리뷰</Card.Title>
                    <ListGroup>
                        {reviews.map((review, index) => (
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col md={2}>
                                        {/* 유저 프로필 이미지 */}
                                        <Image src="/book_wallpaper.jpg" roundedCircle style={styles.profileImg} />
                                        <Form.Label>이지은</Form.Label>
                                    </Col>
                                    <Col md={8}>
                                        {/* 유저 닉네임과 리뷰 텍스트 */}
                                        <p>{review.text}</p>
                                    </Col>
                                    <Col md={2}>
                                        <Button variant="outline-dark" size="sm">
                                            Edit
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ReviewForm;

const styles = {
    profileImg: {
        width: '50px',
        height: '50px',
        borderRadius: '100%',
        marginRight: '15px'
    }
}