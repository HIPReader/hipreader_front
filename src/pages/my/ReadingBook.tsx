import React, { useEffect, useState } from 'react';

export default function ReadingBook() {
  const [readingBooks, setReadingBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    fetch('/api/v1/user_books/my/reading', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('읽고 있는 책을 가져오는 데 실패했습니다.');
        return res.json();
      })
      .then((data) => {
        setReadingBooks(data.content || []);
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
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>읽고 있는 책</h2>

      {readingBooks.length === 0 ? (
        <div>아직 읽고 있는 책이 없습니다.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>제목</th>
              <th style={thStyle}>저자</th>
              <th style={thStyle}>진행률</th>
            </tr>
          </thead>
          <tbody>
            {readingBooks.map((book, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{book.title}</td>
                <td style={tdStyle}>{book.author}</td>
                <td style={tdStyle}>{book.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 스타일용
const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#f5f5f5',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px',
};
