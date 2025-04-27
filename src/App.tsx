import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import My from './pages/my/My';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <Header />
      <div style={{ flex: 1, marginTop: '80px'}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/my/*' element={<My />} />
      </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;