import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";

interface DiscussionMyApplied {
    userDiscussionId: number;
    discussionId: number;
    discussionTopic: string;
    participants: number;
    discussionStatus: 'WAITING' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';
    applicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    scheduledAt: string;
    hostNickname: string;
    bookTitle: string;
}

export default function DiscussionMyApplied() {
    const [discussions, setDiscussions] = useState<DiscussionMyApplied[]>([]);
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

    const handleEnterBtn = (discussionId: number) => {
        navigate(`/chat?roomId=${discussionId}`);
    };

    return (
        <Container>
            <h2 style={styles.title} className="fw-bold pb-3 mb-4">내가 신청한 토론방</h2>

            <table className="table table-hover mt-3">
                <thead className="table-light">
                <tr>
                    <th>책</th>
                    <th>주제</th>
                    <th>참여자</th>
                    <th>예정일</th>
                    <th>호스트</th>
                    <th>토론방 상태</th>
                    <th>신청 상태</th>
                    <th>입장</th>
                </tr>
                </thead>
                <tbody>
                {discussions.map(d => (
                    <tr key={d.userDiscussionId}>
                        <td>{d.bookTitle}</td>
                        <td>{d.discussionTopic}</td>
                        <td>{d.participants}</td>
                        <td>{new Date(d.scheduledAt).toLocaleString()}</td>
                        <td>{d.hostNickname}</td>
                        <td>{d.discussionStatus}</td>
                        <td>{d.applicationStatus}</td>
                        <td>
                            {d.applicationStatus == 'APPROVED' && d.discussionStatus === 'ACTIVE' ?
                                <Button
                                    className="btn btn-sm btn-light btn-outline-dark"
                                    onClick={() => handleEnterBtn(d.discussionId)}
                                >
                                    입장
                                </Button>
                                : <></>
                            }
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