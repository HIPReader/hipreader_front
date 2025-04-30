import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';

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

interface UserBook {
  userBookId: number;
  bookId: number;
}

export default function Search() {
  const [books, setBooks] = useState<Book[]>([]);
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const keyword = query.get('query');

  // 책 검색
  useEffect(() => {
    if (keyword) {
      fetch(`/api/v1/search?keyword=${encodeURIComponent(keyword)}`)
        .then((res) => res.json())
        .then((data) => setBooks(data))
        .catch((err) => console.error('검색 실패', err));
    }
  }, [keyword]);

  // 찜한 책 목록 불러오기
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    fetch('/api/v1/user_books/my', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const simplified = data.content.map((ub: any) => ({
          userBookId: ub.userBookId,
          bookId: ub.bookId,
        }));
        setUserBooks(simplified);
      })
      .catch((err) => console.error('찜 목록 불러오기 실패', err));
  }, []);

  const getUserBookId = (bookId: number): number | undefined => {
    return userBooks.find((ub) => ub.bookId === bookId)?.userBookId;
  };

  const toggleBook = async (bookId: number) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    const userBookId = getUserBookId(bookId);

    if (userBookId) {
      // 찜 해제
      try {
        await fetch(`/api/v1/user_books/${userBookId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUserBooks((prev) => prev.filter((ub) => ub.bookId !== bookId));
      } catch (error) {
        console.error('찜 해제 실패', error);
      }
    } else {
      // 찜 등록
      try {
        const res = await fetch('/api/v1/user_books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ bookId, status: 'TO_READ' }),
        });

        if (res.ok) {
          const data = await res.json();
          setUserBooks((prev) => [...prev, { bookId, userBookId: data.userBookId }]);
        } else {
          const errorData = await res.json();
          alert('등록 실패: ' + (errorData.message || '에러가 발생했습니다.'));
        }
      } catch (error) {
        console.error('서버 오류 발생', error);
      }
    }
  };

  if (!keyword) return <div>검색어가 없습니다.</div>;

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ marginBottom: '20px' }}>검색 결과: "{keyword}"</h2>
      {books.length === 0 ? (
        <div>검색 결과가 없습니다.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '80%' }}>
          {books.map((book) => {
            const isLiked = !!getUserBookId(book.id);

            return (
              <div
                key={book.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  gap: '20px',
                }}
              >
                <div style={{ display: 'flex', gap: '20px' }}>
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    width={70}
                    height={100}
                    style={{ borderRadius: '4px', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>
                        <Link to={`/books/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {book.title}
                        </Link>
                    </h3>
                    <p style={{ margin: 0, color: '#555' }}>{book.author}</p>
                  </div>
                </div>
                <Tooltip title={isLiked ? '찜 해제' : '찜하기'}>
                  <div
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                    onClick={() => toggleBook(book.id)}
                  >
                    {isLiked ? (
                      <FavoriteIcon style={{ color: 'red' }} />
                    ) : (
                      <FavoriteBorderIcon style={{ color: 'gray' }} />
                    )}
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
