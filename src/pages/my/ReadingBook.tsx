import React, { useEffect, useState } from 'react';

interface ReadingBook {
  userBookId: number;
  title: string;
  author: string;
  percentage: number;
  createdAt: string;
}

export default function ReadingList() {
  const [readingBooks, setReadingBooks] = useState<ReadingBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<ReadingBook | null>(null);
  const [progressInput, setProgressInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    fetch('/api/v1/user_books/my/reading', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => {
        setReadingBooks(data.content || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const openModal = (book: ReadingBook) => {
    setSelectedBook(book);
    setProgressInput(''); // 초기화
  };

  const closeModal = () => {
    setSelectedBook(null);
    setProgressInput('');
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const progress = parseInt(progressInput);
    if (!accessToken || !selectedBook) return;

    try {
      const res = await fetch(`/api/v1/user_books/${selectedBook.userBookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: 'READING',
          progress,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setReadingBooks(prev =>
          prev.map(b =>
            b.userBookId === selectedBook.userBookId
              ? { ...b, percentage: updated.percentage }
              : b
          )
        );
        closeModal();
      } else {
        const errorData = await res.json();
        alert(errorData.message || '업데이트 실패');
      }
    } catch (e) {
      console.error(e);
      alert('서버 오류');
    }
  };

  const formatDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '.');

  if (loading) return <div>로딩중...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>읽고 있는 책</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
  <thead style={{ backgroundColor: '#f0f0f0' }}>
    <tr>
      <th style={{ border: '1px solid #ccc', padding: '8px' }}>제목</th>
      <th style={{ border: '1px solid #ccc', padding: '8px' }}>저자</th>
      <th style={{ border: '1px solid #ccc', padding: '8px' }}>시작일</th>
      <th style={{ border: '1px solid #ccc', padding: '8px' }}>진행률</th>
    </tr>
  </thead>
  <tbody>
    {readingBooks.map((book) => (
      <tr
        key={book.userBookId}
        onClick={() => openModal(book)}
        style={{ cursor: 'pointer' }}
      >
        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{book.title}</td>
        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{book.author}</td>
        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{formatDate(book.createdAt)}</td>
        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{book.percentage}%</td>
      </tr>
    ))}
  </tbody>
</table>

      {/* 모달 */}
      {selectedBook && (
        <div
          style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            zIndex: 1000,
          }}
        >
          <h3>{selectedBook.title}</h3>
          <div>
            오늘까지 읽은 페이지:
            <input
              type="number"
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </div>
          <button onClick={handleSubmit} style={{ marginTop: '10px' }}>등록</button>
          <button onClick={closeModal} style={{ marginLeft: '10px' }}>취소</button>
        </div>
      )}
    </div>
  );
}
