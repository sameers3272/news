import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Bookmarks from './pages/Bookmarks';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-100">
        <Navbar />
        <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8">
          <main className="w-full py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
