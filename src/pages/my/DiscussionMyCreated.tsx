import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";

export interface DiscussionMyCreated {
    id: number;
    topic: string;
    participants: number;
    scheduledAt: string;
    status: string;
    hostNickname: string;
    bookTitle: string;
    mode: string;
}

export default function DiscussionMyCreated() {
    const [discussions, setDiscussions] = useState<DiscussionMyCreated[]>([]);
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
            const response = await fetch(`/api/v1/discussions/my`, {
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
            console.log(data.content);
            setDiscussions(data.content);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEnterBtn = (discussionId: number) => {
        navigate(`/chat?roomId=${discussionId}`);
    };

    return (
        <Container>
            <h2 style={styles.title} className="fw-bold pb-3 mb-4">내가 만든 토론방</h2>

            <table className="table table-hover mt-3">
                <thead className="table-light">
                <tr>
                    <th>책</th>
                    <th>주제</th>
                    <th>참여자</th>
                    <th>예정일</th>
                    <th>호스트</th>
                    <th>토론 방식</th>
                    <th>상태</th>
                    <th>신청 / 입장</th>
                </tr>
                </thead>
                <tbody>
                {discussions.map(d => (
                    <tr key={d.id}>
                        <td>{d.bookTitle}</td>
                        <td>{d.topic}</td>
                        <td>{d.participants}</td>
                        <td>{new Date(d.scheduledAt).toLocaleString()}</td>
                        <td>{d.hostNickname}</td>
                        <td>{d.mode == 'AUTO_APPROVAL' ? '선착순' : '승인 방식'}</td>
                        <td>{d.status}</td>
                        <td>
                            <Button
                                className="btn btn-sm btn-light btn-outline-dark"
                                onClick={() => handleEnterBtn(d.id)}
                            >
                                입장
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
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
        gap: '15px'
    },

}