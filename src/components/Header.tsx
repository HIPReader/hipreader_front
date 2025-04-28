import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Container from 'react-bootstrap/Container';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleProfileClick = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate('/my/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <header style={styles.header}>
      <Container style={styles.container}>
        {/* 왼쪽: 로고 */}
        <div style={styles.left}>
          <Link to="/">
            <img
              // src={searchOpen ? '/logo.png' : '/logo2.png'}
                src={'/logo2.png'}
              alt="힙한리더 로고"
              style={styles.logo}
            />
          </Link>
        </div>

        {/* 오른쪽: 검색버튼 + 로그인/마이페이지 + 메뉴버튼 */}
        <div style={styles.right}>
          <div style={styles.searchWrap}>
            <input
                type="text"
                placeholder="제목 검색하기"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={styles.searchInput}
            />
            <SearchIcon
                fontSize="medium"
                style={{ ...styles.iconClickable, ...styles.iconColor }}
                onClick={() => setSearchOpen((prev) => !prev)}
            />
          </div>
          <AccountCircleIcon
            fontSize="medium"
            style={{ ...styles.iconClickable, ...styles.iconColor }}
            onClick={handleProfileClick}
          />
          <button style={styles.iconButton}>
            <MenuIcon fontSize="medium" style={styles.iconColor} />
          </button>
        </div>
      </Container>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    height: '70px',
    padding: '0 16px',
    backgroundColor: '#0A192F',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logo: {
    height: '40px',
  },
  searchWrap: {
    display: 'flex',             // 가로로 배치
    alignItems: 'center',        // 세로 중앙 정렬
    backgroundColor: 'white',    // 배경색을 흰색으로
    border: '1px solid #ccc',    // 테두리 설정
    borderRadius: '5px',         // 둥근 모서리 설정
    padding: '3px 10px',
  },
  searchInput: {
    flexGrow: 1,
    maxWidth: '400px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    outline:'none'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  iconClickable: {
    cursor: 'pointer',
  },
  iconColor: {
    color: '#A7B6C2',
  },
};
