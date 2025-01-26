import { useState, useEffect, useCallback } from 'react';

function NewsSlider({ articles }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const transition = useCallback((type, newIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(type);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentIndex === articles.length - 1 ? 0 : currentIndex + 1;
      transition('next', nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, articles.length, transition]);

  const handleNext = () => {
    const nextIndex = currentIndex === articles.length - 1 ? 0 : currentIndex + 1;
    transition('next', nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = currentIndex === 0 ? articles.length - 1 : currentIndex - 1;
    transition('prev', prevIndex);
  };

  const handleDotClick = (index) => {
    if (index === currentIndex) return;
    transition(index > currentIndex ? 'next' : 'prev', index);
  };

  // Handle touch events for swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const dummyImage = 'https://placehold.co/1200x400/eee/999?text=No+Image+Available';

  if (!articles || articles.length === 0) return null;

  return (
    <div 
      className="w-full relative mb-8 bg-gray-100 rounded-lg overflow-hidden shadow-lg group"
      style={{ height: 'min(400px, 60vh)' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute inset-0 w-full h-full">
        {articles.map((article, index) => (
          <div
            key={article.url}
            className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 z-10 scale-100' 
                : 'opacity-0 z-0 scale-110'
            } ${
              isTransitioning && index === currentIndex
                ? direction === 'next'
                  ? 'translate-x-0'
                  : 'translate-x-0'
                : ''
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={article.urlToImage || dummyImage}
                alt={article.title}
                onError={(e) => { e.target.src = dummyImage }}
                className="absolute inset-0 w-full h-full object-cover object-center transform scale-100"
                style={{ objectPosition: '50% 50%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white z-20">
        {articles.map((article, index) => (
          <div
            key={article.url}
            className={`transition-all duration-500 ease-in-out transform ${
              index === currentIndex 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            style={{ display: index === currentIndex ? 'block' : 'none' }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 line-clamp-2">
              {article.title}
            </h2>
            <p className="text-gray-200 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base md:text-lg hidden sm:block">
              {article.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <span className="text-gray-300 text-sm order-2 sm:order-1">
                {new Date(article.publishedAt).toLocaleDateString()}
              </span>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="order-1 sm:order-2 w-full sm:w-auto text-center px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Read Full Story
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {articles.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-4 sm:w-6' 
                : 'bg-white/50 w-1.5 sm:w-2 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Hide arrows on mobile, show on hover for desktop */}
      <div className="hidden sm:block">
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 transition-all duration-300 z-30 opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 transition-all duration-300 z-30 opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NewsSlider;
