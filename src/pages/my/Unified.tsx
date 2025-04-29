import React, { useEffect, useState } from 'react';

export default function Unified() {
  const [readingBooks, setReadingBooks] = useState<any[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<any[]>([]);
  const [wishBooks, setWishBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    fetch('/api/v1/user_books/my', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      if (!res.ok) throw new Error('책 데이터를 가져오지 못했습니다.');
      return res.json();
    })
    .then((data) => {
      const books = data.content || [];

      // status 기준으로 분리
      setReadingBooks(books.filter((b: any) => b.status === 'READING'));
      setFinishedBooks(books.filter((b: any) => b.status === 'FINISHED'));
      setWishBooks(books.filter((b: any) => b.status === 'TO_READ'));
      setLoading(false);
    })
    .catch((err) => {
      console.error('에러:', err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>로딩중...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>독서 현황 통합</h2>

      {/* 다 읽은 책 */}
      <Section title="다 읽은 책" books={finishedBooks} />

      {/* 읽고 있는 책 */}
      <Section title="읽고 있는 책" books={readingBooks} showProgress />

      {/* 찜한 책 */}
      <Section title="읽고 싶은 책" books={wishBooks} />
    </div>
  );
}

// 📦 공통 Section 컴포넌트
function Section({ title, books, showProgress = false }: { title: string; books: any[]; showProgress?: boolean }) {
  return (
    <section style={{ marginBottom: '40px' }}>
      <h3>{title}</h3>
      <hr />
      {books.length === 0 ? (
        <div>표시할 책이 없습니다.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
          {books.map((book, idx) => (
            <div key={idx} style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
              <div><strong>제목:</strong> {book.title}</div>
              <div><strong>저자:</strong> {book.author}</div>
              {showProgress && (
                <div><strong>진행률:</strong> {book.percentage}%</div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
