import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Bookmarks from './pages/Bookmarks';

function App() {
  return (
    <Router basename="/news">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
