import { Routes, Route } from 'react-router-dom';

import LeftSidebar from './LeftSidebar';
import Mypage from './Profile';
import FinishedBook from './FinishedBook';
import ReadingBook from './ReadingBook';
import Unified from './Unified';
import Discussion from './Discussion';
import Statistics from './Statistics';
import WishList from './WishList';


export default function My() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LeftSidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        <Routes>
          <Route path="profile" element={<Mypage />} />
          <Route path="unified" element={<Unified />} />
          <Route path="finished" element={<FinishedBook />} />
          <Route path="reading" element={<ReadingBook />} />
          <Route path="wishlist" element={<WishList />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="discussion" element={<Discussion />} />
        </Routes>
      </div>
    </div>
  );
}
