import React, {useEffect, useState} from "react";
import {Card, ListGroup, Button, Form, Row, Col} from "react-bootstrap";

interface ReadReviewResponseDto {
    id: number;
    content: string;
    rating: number;
    userId: number;
    bookId: number;
    createdAt: string;
}

interface CreateReviewRequestDto {
    bookId: number;
    content: string;
    rating: number;
}

interface Props {
    bookId: number;
}

const ReviewSection: React.FC<Props> = ({bookId}) => {
    const nickname = localStorage.getItem("nickname");
    const [reviews, setReviews] = useState<ReadReviewResponseDto[]>([]);
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [editModeId, setEditModeId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(5);
    const [page, setPage] = useState(0); // 0부터 시작
    const [totalPages, setTotalPages] = useState(0);

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchReviews(page);
    }, [bookId, page]);

    const fetchReviews = async (pageNumber: number) => {
        try {
            const response = await fetch(
                `/api/v1/books/${bookId}/reviews?page=${pageNumber}&size=10&sort=createdAt,desc`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch reviews");
            }

            const data = await response.json();
            setReviews(data.content);
            setTotalPages(data.totalPages);
            setPage(data.number); // 현재 페이지 업데이트
        } catch (error) {
            console.error("리뷰 조회 실패:", error);
        }
    };


    const handleSubmit = async () => {
        if (!newReview.trim()) return;

        try {
            const payload: CreateReviewRequestDto = {
                bookId,
                content: newReview,
                rating: newRating,
            };

            const response = await fetch("/api/v1/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                alert(errorBody.message);
                return;
            }

            setNewReview("");
            setNewRating(5);
            fetchReviews(page);
        } catch (error) {
            console.error("리뷰 작성 실패:", error);
            alert((error as Error).message);
        }
    };

    const handleDelete = async (reviewId: number) => {
        try {
            const response = await fetch(`/api/v1/books/${bookId}/reviews/${reviewId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("리뷰 삭제 실패");
            }

            fetchReviews(page);
        } catch (error) {
            console.error("리뷰 삭제 실패:", error);
        }
    };

    const handleEdit = (review: ReadReviewResponseDto) => {
        setEditModeId(review.id);
        setEditContent(review.content);
        setEditRating(review.rating);
    };

    const handleEditSubmit = async (reviewId: number) => {
        try {
            const payload = {
                content: editContent,
                rating: editRating,
            };

            const response = await fetch(`/api/v1/books/${bookId}/reviews/${reviewId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("리뷰 수정 실패");
            }

            setEditModeId(null);
            fetchReviews(page);
        } catch (error) {
            console.error("리뷰 수정 실패:", error);
        }
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
        const dd = String(date.getDate()).padStart(2, "0");

        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    };

    return (
        <>
            <Card className="mt-5 mb-3 shadow-sm">
                <Card.Header as="h5">📚 리뷰</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group controlId="reviewTextarea">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="리뷰를 작성해 주세요."
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                            />
                        </Form.Group>
                        <div className={"d-flex gap-2 float-end"}>
                            <Form.Group controlId="reviewRating" className="mt-3">
                                <Form.Select
                                    value={newRating}
                                    onChange={(e) => setNewRating(Number(e.target.value))}
                                >
                                    <option value={5}>★★★★★ (5점)</option>
                                    <option value={4}>★★★★☆ (4점)</option>
                                    <option value={3}>★★★☆☆ (3점)</option>
                                    <option value={2}>★★☆☆☆ (2점)</option>
                                    <option value={1}>★☆☆☆☆ (1점)</option>
                                </Form.Select>
                            </Form.Group>

                            <div className="mt-3 d-flex justify-content-end">
                                <Button variant="dark" onClick={handleSubmit}>
                                    등록하기
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card.Body>
                <ListGroup variant="flush">
                    {reviews.map((review) => (
                        <ListGroup.Item key={review.id} className={"py-3"}>
                            <Row>
                                <Col xs={11}>
                                    <strong>{nickname}</strong>
                                    <div className="text-muted" style={{fontSize: "0.85rem"}}>
                                        {formatTime(review.createdAt)}
                                    </div>

                                    {editModeId === review.id ? (
                                        <>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="my-2"
                                            />
                                            <Form.Select
                                                value={editRating}
                                                onChange={(e) => setEditRating(Number(e.target.value))}
                                                className="mb-2"
                                            >
                                                <option value={5}>★★★★★ (5점)</option>
                                                <option value={4}>★★★★☆ (4점)</option>
                                                <option value={3}>★★★☆☆ (3점)</option>
                                                <option value={2}>★★☆☆☆ (2점)</option>
                                                <option value={1}>★☆☆☆☆ (1점)</option>
                                            </Form.Select>
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => handleEditSubmit(review.id)}
                                                className="me-2"
                                            >
                                                수정완료
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => setEditModeId(null)}
                                            >
                                                취소
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                                            </div>
                                            <div className="mt-1">{review.content}</div>
                                            <div className="mt-2 d-flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline-dark"
                                                    onClick={() => handleEdit(review)}
                                                >
                                                    수정
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-dark"
                                                    onClick={() => handleDelete(review.id)}
                                                >
                                                    삭제
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
            <div className="d-flex justify-content-center mb-5">
            {Array.from({ length: totalPages }, (_, idx) => (
                <Button
                    key={idx}
                    variant={idx === page ? "dark" : "outline-dark"}
                    onClick={() => setPage(idx)}
                    className="mx-1"
                    size="sm"
                >
                    {idx + 1}
                </Button>
            ))}
        </div>
        </>
    );
};

export default ReviewSection;
