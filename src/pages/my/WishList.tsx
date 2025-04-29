import React, { useEffect, useState } from 'react';

export default function WishList() {
  const [wishBooks, setWishBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    fetch('/api/v1/user_books/my/wish', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('찜한 책을 가져오는 데 실패했습니다.');
        return res.json();
      })
      .then((data) => {
        setWishBooks(data.content || []);
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
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>찜한 책</h2>

      {wishBooks.length === 0 ? (
        <div>아직 찜한 책이 없습니다.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {wishBooks.map((book, idx) => (
            <div key={idx} style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
              <div><strong>제목:</strong> {book.title}</div>
              <div><strong>저자:</strong> {book.author}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
