import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import BookIcon from '@mui/icons-material/Book';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Container from 'react-bootstrap/Container';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

export default function Header() {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false); // 드롭다운 상태 관리

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate('/my/profile');
    } else {
      navigate('/login');
    }
  };

  const handleSearch = () => {
    if (searchText.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
    } else {
      alert('검색어를 입력해주세요.');
    }
  }

  return (
    <header style={styles.header}>
      <Container style={styles.container}>
        {/* 왼쪽: 로고 */}
        <div style={styles.left}>
          <Link to="/">
            <img
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
                onClick={handleSearch}
            />
          </div>
          <AccountCircleIcon
            fontSize="medium"
            style={{ ...styles.iconClickable, ...styles.iconColor }}
            onClick={handleProfileClick}
          />

          <div style={{ position:'relative' }}>
            {/* 햄버거 메뉴 버튼 */}
            <button style={styles.iconButton} onClick={toggleDropdown}>
              <MenuIcon fontSize="medium" style={styles.iconColor} />
            </button>

            {/* 드롭다운 메뉴 */}
            {isOpen && (
                <div style={styles.dropdownMenu}>
                  <Nav className="ml-auto" style={{ display: 'block' }}>
                    <Nav.Link style={styles.navLink} as={Link} to="/">
                      <HomeIcon style={styles.naviIcon} /> 홈
                    </Nav.Link>
                    <Nav.Link style={styles.navLink} as={Link} to="/discussions">
                      <ForumIcon style={styles.naviIcon} /> 토론방
                    </Nav.Link>
                    <Nav.Link style={styles.navLink} as={Link} to="/posts">
                      <AnnouncementIcon style={styles.naviIcon} /> 게시판
                    </Nav.Link>
                    <Nav.Link style={styles.navLink} as={Link} to="/books/register">
                      <BookIcon style={styles.naviIcon} /> 책 등록
                    </Nav.Link>
                  </Nav>
                </div>
            )}
          </div>
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
  dropdownMenu: {
    position: 'absolute' as 'absolute',
    top: '35px', // 햄버거 메뉴 버튼 아래로 내려오는 위치
    left: '0',
    backgroundColor: '#fff',
    border: '1px solid #ddd', // 경계선
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // 그림자 효과
    borderRadius: '4px', // 둥근 모서리
    zIndex: 1000, // 다른 요소들 위에 나타나게
    width: '130px',
    padding: '10px 0', // 메뉴 항목 사이의 간격
  },
  navLink: {
    display: 'block',
    color: 'black'
  },
  naviIcon: {
    marginRight: '8px', // 아이콘과 텍스트 간 간격
    fontSize: '20px', // 아이콘 크기 조정
    color: '#0A192F', // 아이콘 색상 조정
  }
};
