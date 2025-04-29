import React, { useEffect, useState } from 'react';

export default function FinishedBook() {
  const [finishedBooks, setFinishedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    fetch('/api/v1/user_books/my/finished', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('다 읽은 책을 가져오는 데 실패했습니다.');
        return res.json();
      })
      .then((data) => {
        setFinishedBooks(data.content || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩중...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>다 읽은 책</h2>

      {finishedBooks.length === 0 ? (
        <div>아직 다 읽은 책이 없습니다.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {finishedBooks.map((book, idx) => (
            <div key={idx} style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
              <div><strong>제목:</strong> {book.title}</div>
              <div><strong>저자:</strong> {book.author}</div>
              <div><strong>진행률:</strong> {book.percentage}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
