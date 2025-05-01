import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';

export interface Discussion {
    id: number;
    topic: string;
    participants: number;
    scheduledAt: string;
    status: string;
    hostNickname: string;
    bookTitle: string;
    mode: string;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    number: number; // 현재 페이지 (0부터 시작)
}

const DiscussionList: React.FC = () => {
    const token = localStorage.getItem("accessToken");
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const navigate = useNavigate();

    const fetchDiscussions = async (pageNum: number) => {
        try {
            const response = await fetch(`/api/v1/discussions?page=${pageNum}&size=10`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch discussions');
            const data: PageResponse<Discussion> = await response.json();
            setDiscussions(data.content);
            setTotalPages(data.totalPages);
            setPage(data.number + 1); // 0-based → 1-based
        } catch (error) {
            console.error(error);
            alert('토론방 목록을 불러오지 못했습니다.');
        }
    };

    useEffect(() => {
        fetchDiscussions(1);
    }, []);

    const handlePageClick = (newPage: number) => {
        fetchDiscussions(newPage);
    };

    const handleEnterBtn = (discussionId: number) => {
        navigate(`/chat?roomId=${discussionId}`);
    };

    const handleApplyBtn = async (discussionId: number) => {
        try {
            const response = await fetch(`/api/v1/userDiscussions/apply`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ discussionId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || '토론방 신청을 실패했습니다.');
                return;
            }

            alert(`${discussionId}번 토론방 신청되었습니다.`);
        } catch (error) {
            console.error(error);
            alert('토론방 신청 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 style={{borderBottom: '1px solid #dbdbdb'}} className="fw-bold pt-5 pb-3 mb-4">토론방 목록</h2>

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
                            {d.mode === 'AUTO_APPROVAL' && d.status === 'ACTIVE' ? (
                                <Button
                                    className="btn btn-sm btn-light btn-outline-dark"
                                    onClick={() => handleEnterBtn(d.id)}
                                >
                                    입장
                                </Button>
                            ) : d.mode === 'MANUAL_APPROVAL' && d.status === 'WAITING' ? (
                                <Button
                                    className="btn btn-sm btn-light btn-outline-dark"
                                    onClick={() => handleApplyBtn(d.id)}
                                >
                                    신청
                                </Button>
                            ) : null}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <nav className="d-flex justify-content-center">
                <ul className="pagination">
                    {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
                        <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageClick(p)}>
                                {p}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default DiscussionList;