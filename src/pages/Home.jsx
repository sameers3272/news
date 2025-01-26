import { useState, useEffect } from 'react';
import { getTopHeadlines, searchNews } from '../services/api';
import NewsCard from '../components/NewsCard';
import NewsSlider from '../components/NewsSlider';

export const categories = [
  { id: 'general', name: 'General' },
  { id: 'business', name: 'Business' },
  { id: 'technology', name: 'Technology' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'sports', name: 'Sports' },
  { id: 'science', name: 'Science' },
  { id: 'health', name: 'Health' }
];

function Home() {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('general');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      
      if (searchQuery) {
        data = await searchNews({ q: searchQuery });
      } else {
        data = await getTopHeadlines({ category });
      }

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Listen for country changes
  useEffect(() => {
    const handleStorage = () => {
      fetchNews();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [searchQuery, category]);

  useEffect(() => {
    fetchNews();
  }, [searchQuery, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchQuery(formData.get('search'));
    setCategory('general'); // Reset category when searching
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchQuery(''); // Clear search when changing category
  };

  const displayedCategories = showAllCategories 
    ? categories 
    : categories.slice(0, 4);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="order-1 sm:order-2 sm:flex-1">
            <div className="flex gap-2">
              <input
                type="search"
                name="search"
                placeholder="Search news..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          {/* Categories */}
          <div className="order-2 sm:order-1 sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-2">
                {displayedCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      category === cat.id
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
                {categories.length > 4 && (
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                  >
                    {showAllCategories ? 'Show Less' : 'More'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!searchQuery && articles.length > 0 && (
        <NewsSlider articles={articles.slice(0, 5)} />
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 my-8">{error}</div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.url} article={article} />
          ))}
          {articles.length === 0 && (
            <div className="col-span-full text-center text-gray-500 my-8">
              No articles found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
