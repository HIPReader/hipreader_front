import React, { useEffect, useState } from 'react';

interface WishBook {
  userBookId: number;
  bookId: number;
  title: string;
  author: string;
  totalPages: number;
}

export default function WishList() {
  const [wishBooks, setWishBooks] = useState<WishBook[]>([]);
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

  const handleStartReading = async (userBookId: number) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const res = await fetch(`/api/v1/user_books/${userBookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: 'READING',
          progress: 1,
        }),
      });

      if (res.ok) {
        alert('읽기 시작으로 등록되었습니다.');
        setWishBooks((prev) => prev.filter((b) => b.userBookId !== userBookId));
      } else {
        const errorData = await res.json();
        alert(errorData.message || '업데이트 실패');
      }
    } catch (err) {
      console.error('업데이트 중 오류', err);
      alert('서버 오류');
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>찜한 책</h2>

      {wishBooks.length === 0 ? (
        <div>아직 찜한 책이 없습니다.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {wishBooks.map((book) => (
            <div
              key={book.userBookId}
              style={{
                border: '1px solid #ccc',
                padding: '12px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div><strong>제목:</strong> {book.title}</div>
                <div><strong>저자:</strong> {book.author}</div>
              </div>
              <button
                style={{ padding: '6px 12px', cursor: 'pointer' }}
                onClick={() => handleStartReading(book.userBookId)}
              >
                읽기 시작
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
