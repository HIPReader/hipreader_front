import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface Book {
  id: number;
  categoryName: string;
  title: string;
  isbn13: string;
  author: string;
  publisher: string;
  datePublished: string;
  totalPages: number;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

export default function Search() {
  const [books, setBooks] = useState<Book[]>([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const keyword = query.get('query');

  useEffect(() => {
    if (keyword) {
      fetch(`/api/v1/search?keyword=${encodeURIComponent(keyword)}`)
        .then((res) => res.json())
        .then((data) => setBooks(data))
        .catch((err) => console.error('검색 실패', err));
    }
  }, [keyword]);

  if (!keyword) {
    return <div>검색어가 없습니다.</div>;
  }

  async function registerBook(bookId: number, status: 'TO_READ' | 'READING' | 'FINISHED') {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch('/api/v1/user_books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          bookId: bookId,
          status: status
        })
      });

      if (response.ok) {
        alert('책 등록 완료!');
      } else {
        const errorData = await response.json();
        alert('등록 실패: ' + (errorData.message || '에러가 발생했습니다.'));
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류가 발생했습니다.');
    }
  }


  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ marginBottom: '20px' }}>검색 결과: "{keyword}"</h2>
      {books.length === 0 ? (
        <div>검색 결과가 없습니다.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '80%' }}>
          {books.map((book, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                gap: '20px',
              }}
            >
              <img
                src={book.coverImage}
                alt={book.title}
                width={70}
                height={100}
                style={{ borderRadius: '4px', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>{book.title}</h3>
                <p style={{ margin: 0, color: '#555' }}>{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
