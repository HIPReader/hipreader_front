import {useParams, useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const [book, setBook] = useState<BookDetail | null>(null);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem("accessToken");
    const [topic, setTopic] = useState('');
    const [participants, setParticipants] = useState<number | string>(0);
    const [scheduledAt, setScheduledAt] = useState('');
    const [mode, setMode] = useState('AUTO_APPROVAL'); // 기본값 설정

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        fetch(`/api/v1/books/${id}`)
            .then(res => res.json())
            .then(data => setBook(data))
            .catch(err => console.error('책 정보 불러오기 실패', err));
    }, [id]);

    const createDiscussion = () => {
        if (!book) return;

        const requestBody = {
            topic,
            participants,
            scheduledAt,
            mode,
            bookId: book.id
        };

        fetch('/api/v1/discussions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) throw new Error('토론방 생성 실패');
                return response.json();
            })
            .then(data => {
                alert('토론방이 성공적으로 생성되었습니다.');
                handleClose();
                navigate('/discussions');
            })
            .catch(error => {
                console.error('토론방 생성 에러:', error);
                alert('토론방 생성 중 오류가 발생했습니다.');
            });
    };

    if (!book) return <div>로딩 중...</div>;

    return (
        <Container>
            <h2 style={{borderBottom: '1px solid #dbdbdb'}} className="fw-bold pt-5 pb-3 mb-4">책 상세 정보</h2>

            <div className={"mb-5"} style={styles.bookBox}>
                <div>
                    <Image src={book.coverImage || "/book_wallpaper.jpg"} style={styles.bookImg} rounded/>
                </div>
                <div>
                    <Card style={styles.bookCard}>
                        <Card.Body>
                            <Card.Title>{book.title}</Card.Title>
                            <Card.Text className={"py-3"}>
                                <b>작가</b> {book.author}<br/>
                                <b>출판사</b> {book.publisher}<br/>
                                <b>카테고리</b> {book.categoryName}<br/>
                            </Card.Text>
                            <button className={"btn btn-md btn-light btn-outline-dark"} onClick={handleShow}>토론방 만들기</button>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* 모달 */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>토론방 만들기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">주제</label>
                            <input type="text" className="form-control" value={topic}
                                   onChange={(e) => setTopic(e.target.value)} placeholder="토론 주제 입력"/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">참여 인원</label>
                            <input
                                type="number"
                                className="form-control"
                                value={participants}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '') {
                                        setParticipants('');
                                    } else {
                                        setParticipants(Number(val));
                                    }
                                }}
                                placeholder="예: 5"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">토론 예정 시간</label>
                            <input type="datetime-local" className="form-control" value={scheduledAt}
                                   onChange={(e) => setScheduledAt(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">토론 방식</label>
                            <select className="form-control" value={mode} onChange={(e) => setMode(e.target.value)}>
                                <option value="AUTO_APPROVAL">선착순</option>
                                <option value="MANUAL_APPROVAL">승인 방식</option>
                            </select>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={createDiscussion}>
                        생성
                    </Button>
                </Modal.Footer>
            </Modal>

            <Review bookId={book.id} />
        </Container>
    );
}

const styles = {
    bookImg: {
        width: '205px',
        height: '295px',
        objectFit: 'cover' as 'cover'
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
