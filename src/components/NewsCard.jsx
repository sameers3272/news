import { useState, useEffect } from 'react';
import { toggleBookmark, isBookmarked } from '../services/api';

function NewsCard({ article }) {
  const [bookmarked, setBookmarked] = useState(false);
  const dummyImage = 'https://placehold.co/600x400/eee/999?text=No+Image+Available';

  useEffect(() => {
    setBookmarked(isBookmarked(article));
  }, [article]);

  const handleBookmarkClick = () => {
    const isNowBookmarked = toggleBookmark(article);
    setBookmarked(isNowBookmarked);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.urlToImage || dummyImage}
          alt={article.title}
          onError={(e) => { e.target.src = dummyImage }}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleBookmarkClick}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${bookmarked ? 'text-blue-500' : 'text-gray-500'}`}
            fill={bookmarked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Read More →
          </a>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;
