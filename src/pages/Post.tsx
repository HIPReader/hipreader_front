import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Button, Form, ListGroup, Card, Image } from 'react-bootstrap';

export default function Post() {
    const [message, setMessage] = useState('');
    const [entries, setEntries] = useState<{ message: string; timestamp: string }[]>([]);
    const [userName, setUserName] = useState<string>(''); // 사용자 이름 상태 추가

    // 사용자 이름을 백엔드에서 받아오기
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/user'); // 백엔드에서 사용자 정보 API 호출
                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.name); // 사용자 이름 설정
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    // 입력 처리
    const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value);

    // 게시글 제출 처리
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (message) {
            const newEntry = {
                message,
                timestamp: new Date().toLocaleString(),
            };

            setEntries([newEntry, ...entries]); // 기존 글 목록에 추가
            setMessage('');
        }
    };

    return (
        <div className="container py-5">
            <h2 className="fw-bold py-3 text-center">게시판</h2>

            {/* 게시글 입력 폼 */}
            <Form onSubmit={handleSubmit} className="mb-4">
                <div style={styles.profileWithBtn}>
                    <Form.Group className="mb-3">
                        <Image src="/book_wallpaper.jpg" style={styles.profileImg} roundedCircle />
                        <Form.Label>{userName || '이지은'}</Form.Label> {/* 이름을 동적으로 표시 */}
                    </Form.Group>

                    <Button variant="dark" type="submit">
                        등록
                    </Button>
                </div>

                <Form.Group controlId="message" className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="남기고 싶은 메시지를 입력하세요..."
                        value={message}
                        onChange={handleMessageChange}
                        required
                    />
                </Form.Group>
            </Form>

            {/* 게시글 목록 */}
            <h3 className="mb-4">방명록</h3>
            <ListGroup>
                {entries.map((entry, index) => (
                    <ListGroup.Item key={index} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <strong>{userName || '이지은'}</strong> <span className="text-muted">({entry.timestamp})</span>
                                </Card.Title>
                                <Card.Text>{entry.message}</Card.Text>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

const styles = {
    profileWithBtn: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    profileImg: {
        width: '50px',
        height: '50px',
        borderRadius: '100%',
        marginRight: '15px'
    }
}
