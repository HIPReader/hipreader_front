import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    fetch('/api/v1/users/my', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('유저 정보를 불러오는 데 실패했습니다.');
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error(err);
        alert('유저 정보를 불러오는 데 실패했습니다.');
        navigate('/login');
      });
  }, []);

  if (!user) {
    return <div>로딩중...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>My Page</h1>

      <div style={{ marginBottom: '20px' }}>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Nickname:</strong> {user.nickname}</div>
        <div><strong>Age:</strong> {user.age}</div>
        <div><strong>Gender:</strong> {user.gender}</div>
      </div>

      {/* 회원정보 수정 버튼 */}
      <button
        style={{
          width: '250px',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: 'black',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/my/profile/edit')} // 수정 페이지 만들면 이동
      >
        회원정보 수정
      </button>

      <br />

      {/* 로그아웃 버튼 */}
      <button
        style={{
          width: '250px',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: 'black',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={handleLogout}
      >
        로그아웃
      </button>

      {/* 회원탈퇴 링크 */}
      <div style={{ marginTop: '10px' }}>
        <a href="#" style={{ fontSize: '12px', color: '#888', textDecoration: 'underline' }}>
          회원탈퇴
        </a>
      </div>
    </div>
  );
}
