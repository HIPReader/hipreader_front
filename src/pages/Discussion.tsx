import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

interface Discussion {
    userDiscussionId: number;
    discussionId: number;
    discussionTopic: string;
    participants: number;
    discussionStatus: 'WAITING' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';
    applicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    scheduledAt: string;
    appliedAt: string;
}

export default function Discussion() {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        handleDiscussion(accessToken);
    }, [])

    const handleDiscussion = async (accessToken: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/userDiscussions/by-user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('토론방 정보를 가져오는데 실패했습니다.');
            }
            const data = await response.json();
            console.log(data);
            setDiscussions(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2 style={styles.title} className="fw-bold pt-5 pb-3 mb-4">토론방</h2>

            <Row>
                {discussions?.map((discussion) => (
                    <Col key={discussion.discussionId} md={3} className="mb-4">
                        <Card style={{ width: '18rem' }}>
                            {discussion.discussionStatus === 'ACTIVE' && discussion.applicationStatus === 'APPROVED' ? (
                                <Link to={`/chat?roomId=${discussion.discussionId}`} style={{ color: 'black', textDecoration: 'none' }}>
                                    <Card.Img variant="top" src="/logo2.png" style={{ objectFit: 'contain' }} />
                                    <Card.Body>
                                        <Card.Title><b>{discussion.discussionId} 번 토론방</b></Card.Title>
                                        <Card.Text>
                                            <b>주제</b> {discussion.discussionTopic}<br/>
                                            <b>참여자 수</b> {discussion.participants}<br/>
                                            <b>토론방 상태</b> {discussion.discussionStatus}<br/>
                                            <b>신청 상태</b> {discussion.applicationStatus}<br/>
                                            <b>오픈일</b> {discussion.scheduledAt.split('T')[0]}
                                        </Card.Text>
                                    </Card.Body>
                                </Link>
                            ) : (
                                <>
                                    <Card.Img variant="top" src="/logo2.png" style={{ objectFit: 'contain' }} />
                                    <Card.Body style={{color:'rgb(167, 182, 194)'}}>
                                        <Card.Title><b>{discussion.discussionId} 번 토론방</b></Card.Title>
                                        <Card.Text>
                                            <b>주제</b> {discussion.discussionTopic}<br/>
                                            <b>참여자 수</b> {discussion.participants}<br/>
                                            <b>토론방 상태</b> {discussion.discussionStatus}<br/>
                                            <b>신청 상태</b> {discussion.applicationStatus}<br/>
                                            <b>오픈일</b> {discussion.scheduledAt.split('T')[0]}
                                        </Card.Text>
                                    </Card.Body>
                                </>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

const styles = {
    title: {
        borderBottom: '1px solid #dbdbdb'
    },
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
    },

}