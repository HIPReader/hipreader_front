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
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const content = data.content || [];

        const reading = content.filter((book: any) => book.status === 'READING');
        const finished = content.filter((book: any) => book.status === 'FINISHED');
        const wish = content.filter((book: any) => book.status === 'TO_READ');

        setReadingBooks(reading);
        setFinishedBooks(finished);
        setWishBooks(wish);
        setLoading(false);
      })
      .catch((err) => {
        console.error('책 불러오기 실패:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩중...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>독서 현황 통합</h2>

      {/* 다 읽은 책 */}
      <section style={{ marginBottom: '40px' }}>
        <h3>다 읽은 책</h3>
        <hr />
        {finishedBooks.length === 0 ? (
          <div>다 읽은 책이 없습니다.</div>
        ) : (
          finishedBooks.map((book) => (
            <div key={book.title}>「{book.title}」 {book.author}</div>
          ))
        )}
      </section>

      {/* 읽고 있는 책 */}
      <section style={{ marginBottom: '40px' }}>
        <h3>읽고 있는 책</h3>
        <hr />
        {readingBooks.length === 0 ? (
          <div>읽고 있는 책이 없습니다.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>제목</th>
                <th style={thStyle}>저자</th>
                <th style={thStyle}>시작일</th> {/* 시작일은 지금은 없지만 일단 구조만 잡자 */}
                <th style={thStyle}>%</th>
              </tr>
            </thead>
            <tbody>
              {readingBooks.map((book) => (
                <tr key={book.title}>
                  <td style={tdStyle}>{book.title}</td>
                  <td style={tdStyle}>{book.author}</td>
                  <td style={tdStyle}>-</td> {/* 시작일 없는 경우 대시로 표시 */}
                  <td style={tdStyle}>{book.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 찜한 책 */}
      <section style={{ marginBottom: '40px' }}>
        <h3>읽고 싶은 책</h3>
        <hr />
        {wishBooks.length === 0 ? (
          <div>찜한 책이 없습니다.</div>
        ) : (
          wishBooks.map((book) => (
            <div key={book.title}>「{book.title}」 {book.author}</div>
          ))
        )}
      </section>
    </div>
  );
}

const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#f9f9f9',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px',
};
