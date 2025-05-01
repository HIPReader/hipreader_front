import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BooksDetail from './pages/BooksDetail';
import Post from './pages/Post';
import My from './pages/my/My';
import Search from './pages/Search';
import Chat from './pages/Chat';
import Register from './pages/Register';
import Discussion from './pages/Discussion';

function App() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <div style={{ flex: 1, marginTop: '80px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/books/:id" element={<BooksDetail />} />
                    <Route path="/posts" element={<Post />} />
                    <Route path="/my/*" element={<My />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/books/register" element={<Register />} />
                    <Route path="/discussions" element={<Discussion />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
