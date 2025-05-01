import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";

interface BookRequestDto {
  title: string;
  author: string;
  isbn13: string;
  publisher: string;
  datePublished: string; // "YYYY-MM-DD"
  totalPages: number;
  coverImage: string;
  categoryName: string;
}

export default function Register() {
  const accessToken = localStorage.getItem("accessToken");

  const [form, setForm] = useState<BookRequestDto>({
    title: "",
    author: "",
    isbn13: "",
    publisher: "",
    datePublished: "",
    totalPages: 0,
    coverImage: "",
    categoryName: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: name === "totalPages" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/v1/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "도서 등록 실패");
      }

      setSuccess(true);
      setError("");
    } catch (err) {
      setSuccess(false);
      setError((err as Error).message);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow-sm p-4">
        <Card.Title className="mb-4">📚 도서 등록</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">도서가 성공적으로 등록되었습니다.</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>제목</Form.Label>
            <Form.Control type="text" name="title" value={form.title} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>저자</Form.Label>
            <Form.Control type="text" name="author" value={form.author} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ISBN13</Form.Label>
            <Form.Control type="text" name="isbn13" value={form.isbn13} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>출판사</Form.Label>
            <Form.Control type="text" name="publisher" value={form.publisher} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>출간일</Form.Label>
            <Form.Control type="date" name="datePublished" value={form.datePublished} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>총 페이지 수</Form.Label>
            <Form.Control type="number" name="totalPages" value={form.totalPages} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>표지 이미지 URL</Form.Label>
            <Form.Control type="text" name="coverImage" value={form.coverImage} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>카테고리</Form.Label>
            <Form.Control type="text" name="categoryName" value={form.categoryName} onChange={handleChange} />
          </Form.Group>

          <div className="text-end">
            <Button variant="dark" type="submit">등록하기</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
