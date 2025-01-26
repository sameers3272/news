const NEWS_API_KEY = '088ea250a49e4723aeed3e79e9ba8c55';
const BOOKMARKS_KEY = 'news_bookmarks';
const COUNTRY_KEY = 'news_country';

// List of available countries
export const countries = {
  us: 'United States',
  gb: 'United Kingdom',
  in: 'India',
  au: 'Australia',
  ca: 'Canada',
  nz: 'New Zealand',
  za: 'South Africa',
  ie: 'Ireland',
  sg: 'Singapore'
};

// Get/Set selected country
export const getSelectedCountry = () => {
  return localStorage.getItem(COUNTRY_KEY) || 'us';
};

export const setSelectedCountry = (countryCode) => {
  localStorage.setItem(COUNTRY_KEY, countryCode);
  // Dispatch storage event for cross-tab communication
  window.dispatchEvent(new Event('storage'));
};

const api = axios.create({
  baseURL: 'https://newsapi.org/v2',
  headers: {
    'X-Api-Key': NEWS_API_KEY
  }
});

export const getTopHeadlines = async ({ category = 'general', pageSize = 20, country } = {}) => {
  try {
    const selectedCountry = country || getSelectedCountry();
    const params = new URLSearchParams({
      country: selectedCountry,
      pageSize: pageSize.toString(),
      apiKey: NEWS_API_KEY
    });

    if (category && category !== 'general') {
      params.append('category', category);
    }

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?${params.toString()}`
    );
    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    throw error;
  }
};

export const searchNews = async ({ q, pageSize = 20, sortBy = 'publishedAt', language = 'en' } = {}) => {
  try {
    const params = new URLSearchParams({
      q: encodeURIComponent(q),
      pageSize: pageSize.toString(),
      sortBy,
      language,
      apiKey: NEWS_API_KEY
    });

    const response = await fetch(
      `https://newsapi.org/v2/everything?${params.toString()}`
    );
    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};

// Bookmark management functions
export const getBookmarks = () => {
  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

export const isBookmarked = (article) => {
  try {
    const bookmarks = getBookmarks();
    return bookmarks.some(bookmark => bookmark.url === article.url);
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};

export const toggleBookmark = (article) => {
  try {
    const bookmarks = getBookmarks();
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
};

import axios from 'axios';

export default axios;
