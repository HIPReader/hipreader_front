import { NavLink } from 'react-router-dom';

export default function LeftSidebar() {
  const tabs = [
    { path: 'profile', label: '개인 정보 관리' },
    { path: 'unified', label: '독서 현황 통합' },
    { path: 'finished', label: '다 읽은 책' },
    { path: 'reading', label: '읽고 있는 책' },
    { path: 'wishlist', label: '위시 리스트' },
    { path: 'statistics', label: '나의 독서 통계' },
    { path: 'discussion/created', label: '내가 만든 토론방' },
    { path: 'discussion/applied', label: '내가 신청한 토론방' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={`/my/${tab.path}`}
          style={({ isActive }) => ({
            padding: '10px 50px',
            border: '1px solid black',
            textAlign: 'center',
            fontWeight: isActive ? 'bold' : 'normal',
            backgroundColor: isActive ? 'black' : 'white',
            textDecoration: 'none',
            color: isActive? 'white' : 'black',
          })}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
