const GNEWS_API_KEY = '26b7b66025f9d8b8fad3f3a7f8f0301f';
const BOOKMARKS_KEY = 'news_bookmarks';
const COUNTRY_KEY = 'news_country';

// List of available countries
export const countries = {
  us: 'United States',
  gb: 'United Kingdom',
  in: 'India',
  au: 'Australia',
  ca: 'Canada',
  nz: 'New Zealand'
};

export const getSelectedCountry = () => {
  return localStorage.getItem(COUNTRY_KEY) || 'us';
};

export const setSelectedCountry = (country) => {
  localStorage.setItem(COUNTRY_KEY, country);
  window.dispatchEvent(new Event('storage'));
};

const categoryMap = {
  general: 'general',
  business: 'business',
  technology: 'technology',
  entertainment: 'entertainment',
  sports: 'sports',
  science: 'science',
  health: 'health'
};

const api = {
  async getTopHeadlines({ country = getSelectedCountry(), category = 'general', max = 10 } = {}) {
    try {
      const params = new URLSearchParams({
        token: GNEWS_API_KEY,
        lang: country,
        country: country,
        max: max.toString(),
        category: categoryMap[category] || 'general'
      });

      const response = await fetch(`https://gnews.io/api/v4/top-headlines?${params}`);
      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0]);
      }
      
      // Transform the response to match our existing format
      return {
        status: 'ok',
        articles: data.articles.map(article => ({
          ...article,
          publishedAt: article.publishedAt,
          urlToImage: article.image,
          content: article.content
        }))
      };
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      throw error;
    }
  },

  async searchNews({ q, max = 10 } = {}) {
    try {
      const params = new URLSearchParams({
        token: GNEWS_API_KEY,
        q: encodeURIComponent(q),
        lang: getSelectedCountry(),
        max: max.toString()
      });

      const response = await fetch(`https://gnews.io/api/v4/search?${params}`);
      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0]);
      }
      
      // Transform the response to match our existing format
      return {
        status: 'ok',
        articles: data.articles.map(article => ({
          ...article,
          publishedAt: article.publishedAt,
          urlToImage: article.image,
          content: article.content
        }))
      };
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  },

  // Bookmark management functions
  getBookmarks() {
    try {
      const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  },

  isBookmarked(article) {
    try {
      const bookmarks = this.getBookmarks();
      return bookmarks.some(bookmark => bookmark.url === article.url);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  },

  toggleBookmark(article) {
    try {
      const bookmarks = this.getBookmarks();
      const index = bookmarks.findIndex(bookmark => bookmark.url === article.url);
      
      if (index === -1) {
        // Add bookmark
        bookmarks.push(article);
      } else {
        // Remove bookmark
        bookmarks.splice(index, 1);
      }
      
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      // Dispatch storage event for cross-tab communication
      window.dispatchEvent(new Event('storage'));
      
      return index === -1; // Returns true if bookmark was added, false if removed
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return false;
    }
  }
};

export const { getTopHeadlines, searchNews, getBookmarks, toggleBookmark, isBookmarked } = api;
