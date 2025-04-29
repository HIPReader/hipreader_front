import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Review from '../components/Review'
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

// interface Discussion {
//     id: number;
//     bookId: number;
//     userId: number;
//     userBookId: number
//     discussionTopic: string;
//     clubNo: number;
//     participants: number;
//     status: 'ACTIVE' | 'CLOSED' | 'WAITING' | 'CANCELLED';
//     conditions: string;
//     scheduledAt: number;
// }

interface UserDiscussion {
    userDiscussionId: number;
    discussionId: number;
    discussionTopic: string;
    status: 'APPROVED' | 'WAITING' | 'REJECTED';
    appliedAt: string;
}

export default function Discussion() {
    const [userDiscussion, setUserDiscussion] = useState<UserDiscussion[]>([]);
    const [discussionIds, setDiscussionIds] = useState<number[]>([]);
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
            const discussionIds = data.map((item: UserDiscussion) => item.discussionId);
            console.log(discussionIds);
            // setDiscussionIds(discussionIds);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2 style={styles.title} className="fw-bold pt-5 pb-3 mb-4">토론방</h2>

            {/*<Row>*/}
            {/*    {userD?.map((discussion) => (*/}
            {/*        <Col key={discussion.discussionId} md={4} className="mb-4">*/}
            {/*            <Card style={{ width: '18rem' }}>*/}
            {/*                <Link to="/books/detail" style={{ color: 'black', textDecoration: 'none' }}>*/}
            {/*                    <Card.Img variant="top" src="/logo2.png" style={{ objectFit: 'contain' }}/>*/}
            {/*                    <Card.Body>*/}
            {/*                        <Card.Title><b>{discussion.discussionTopic}</b></Card.Title>*/}
            {/*                        <Card.Text>*/}
            {/*                            <b>clubNo</b> 1<br/>*/}
            {/*                            <b>참여자 수</b> 5<br/>*/}
            {/*                            <b>토론방 상태</b> ACTIVE<br/>*/}
            {/*                            <b>신청 상태</b> APPROVED<br/>*/}
            {/*                            <b>오픈일</b> 2025-04-29*/}
            {/*                        </Card.Text>*/}
            {/*                    </Card.Body>*/}
            {/*                </Link>*/}
            {/*            </Card>*/}
            {/*        </Col>*/}
            {/*    ))}*/}
            {/*</Row>*/}
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