import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { countries, getSelectedCountry, setSelectedCountry } from '../services/api';

function Navbar() {
  const [selectedCountry, setSelected] = useState(getSelectedCountry());
  const [isOpen, setIsOpen] = useState(false);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelected(country);
    setSelectedCountry(country);
    setIsOpen(false);
  };

  // Listen for country changes from other tabs
  useEffect(() => {
    const handleStorage = () => {
      setSelected(getSelectedCountry());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="w-full flex h-16 justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            News
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-6">
          <Link
              to="/bookmarks"
              className="inline-flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
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
              <span>Bookmarks</span>
            </Link>
            {/* Mobile dropdown */}
            <div className="relative sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <span className="text-sm font-medium text-gray-700">
                  {countries[selectedCountry]}
                </span>
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {Object.entries(countries).map(([code, name]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setSelected(code);
                          setSelectedCountry(code);
                          setIsOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          selectedCountry === code
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop select */}
            <div className="hidden sm:block">
              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                className="form-select w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                {Object.entries(countries).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
