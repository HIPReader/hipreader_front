import React, { useEffect, useState } from 'react';

interface AverageStats {
  averageReadingDays: number;
  averagePagesPerBook: number;
  totalFinishedBooks: number;
}

interface BookSummary {
  title: string;
  coverImage: string;
  author: string;
}

interface YearlyStats {
  username: string;
  totalBooks: number;
  totalPages: number;
  books: {
    content: BookSummary[];
    totalPages: number;
    number: number;
  };
}

export default function Statistics() {
  const [averageStats, setAverageStats] = useState<AverageStats | null>(null);
  const [yearlyStats, setYearlyStats] = useState<YearlyStats | null>(null);
  const [page, setPage] = useState(1);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    fetch('/api/v1/statics/average', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => setAverageStats(data));
  }, []);

  useEffect(() => {
    fetch(`/api/v1/statics/yearly?page=${page}&size=5`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => setYearlyStats(data));
  }, [page]);

  if (!averageStats || !yearlyStats) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>📊 나의 독서 통계</h2>

      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-around',
        background: '#f9f9f9'
      }}>
        <div><strong>완독한 책 수</strong><br />{averageStats.totalFinishedBooks}권</div>
        <div><strong>평균 독서 기간</strong><br />{averageStats.averageReadingDays}일</div>
        <div><strong>평균 페이지 수</strong><br />{averageStats.averagePagesPerBook}쪽</div>
      </div>

      <h3>📅 올해 완독한 책 ({yearlyStats.totalBooks}권, 총 {yearlyStats.totalPages}쪽)</h3>
      {yearlyStats.books.content.length === 0 ? (
        <div>아직 올해 완독한 책이 없습니다.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {yearlyStats.books.content.map((book, idx) => (
            <li key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px'
            }}>
              <img src={book.coverImage} alt={book.title} style={{ width: '50px', height: '70px', marginRight: '12px', objectFit: 'cover' }} />
              <div>
                <div><strong>{book.title}</strong></div>
                <div style={{ color: '#666' }}>{book.author}</div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {Array.from({ length: yearlyStats.books.totalPages }, (_, i) => (
          <button
            key={i}
            style={{
              margin: '0 4px',
              padding: '6px 12px',
              background: page === i + 1 ? '#000' : '#eee',
              color: page === i + 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
