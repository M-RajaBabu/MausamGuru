import React, { useState } from 'react';

const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;
const OWM_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

function Search({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = React.useRef();

  const handleInput = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${OWM_API_URL}?q=${encodeURIComponent(value)}&limit=5&appid=${OWM_API_KEY}`);
      const data = await res.json();
      setResults((data || []).filter(place => place.lat && place.lon));
      setShowDropdown(true);
    } catch (err) {
      setResults([]);
      setShowDropdown(false);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    inputRef.current && inputRef.current.focus();
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-2 sm:px-0">
      <label className="font-semibold text-blue-700 mb-1 block text-base sm:text-lg" htmlFor="location-search-input">Search for a location</label>
      <div className="relative flex items-center">
        {/* Search icon */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" aria-hidden="true">
          {/* Inline SVG for search icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Search icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </span>
        <input
          ref={inputRef}
          id="location-search-input"
          type="text"
          className="pl-10 pr-10 py-3 w-full rounded-full border border-blue-200 bg-white shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-base sm:text-lg placeholder-blue-300 focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2"
          placeholder="Enter city, village, or country..."
          value={query}
          onChange={handleInput}
          autoComplete="off"
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
          autoFocus
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="location-search-dropdown"
          aria-activedescendant={showDropdown && results.length > 0 ? `location-option-0` : undefined}
        />
        {/* Clear button */}
        {query && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={handleClear}
            tabIndex={0}
            aria-label="Clear search"
          >
            {/* Inline SVG for X icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Clear icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {loading && <div className="text-xs text-gray-400 mt-1">Loading...</div>}
      {showDropdown && results.length > 0 && (
        <ul
          id="location-search-dropdown"
          className="absolute left-0 right-0 mt-2 bg-white border border-blue-200 rounded-2xl shadow-lg z-[9999] max-h-60 overflow-y-auto animate-fade-in w-full sm:w-auto"
          style={{ minWidth: '0', maxWidth: '100vw' }}
          onMouseLeave={() => setShowDropdown(false)}
          role="listbox"
          aria-label="Location search results"
        >
          {results.map((place, idx) => (
            <li
              key={place.lat + ',' + place.lon + '-' + idx}
              id={`location-option-${idx}`}
              className="px-4 sm:px-5 py-2 sm:py-3 hover:bg-blue-50 cursor-pointer transition rounded-2xl flex flex-col gap-0.5 text-sm sm:text-base"
              onMouseDown={() => {
                setQuery(`${place.name}${place.state ? ", " + place.state : ""}, ${place.country}`);
                setResults([]);
                setShowDropdown(false);
                if (onSelect) onSelect({
                  city: place.name,
                  country: place.country,
                  region: place.state || '',
                  latitude: place.lat,
                  longitude: place.lon,
                });
              }}
              role="option"
              aria-selected={idx === 0}
            >
              <div className="font-medium text-blue-800 truncate">{place.name}{place.state ? `, ${place.state}` : ''}, {place.country}</div>
              <div className="text-xs text-gray-500">Lat: {place.lat}, Lon: {place.lon}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search; 