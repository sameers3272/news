import { useState, useEffect } from 'react';
import { getBookmarks } from '../services/api';
import NewsCard from '../components/NewsCard';

function Bookmarks() {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  useEffect(() => {
    const loadBookmarks = () => {
      const bookmarks = getBookmarks();
      setBookmarkedArticles(bookmarks);
    };

    loadBookmarks();
    // Add event listener for storage changes
    window.addEventListener('storage', loadBookmarks);
    
    return () => {
      window.removeEventListener('storage', loadBookmarks);
    };
  }, []);

  const renderContent = () => {
    if (bookmarkedArticles.length === 0) {
      return (
        <div className="w-full flex items-center justify-center min-h-[500px]">
          <div className="text-center text-gray-600">
            <p>No bookmarked articles yet.</p>
            <p className="mt-2 text-sm">Articles you bookmark will appear here.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarkedArticles.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col space-y-8">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900">Bookmarked Articles</h1>
      </div>

      {renderContent()}
    </div>
  );
}

export default Bookmarks;
