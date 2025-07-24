import React, { useEffect, useState, useRef } from 'react';

const GEMINI_API_KEY = 'AIzaSyDhupaEFgHs0eXjrjKpIeQsLtpeOkYuue0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY;

function AISidebar({ weather, location }) {
  const [aiInfo, setAiInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimeout = useRef();

  useEffect(() => {
    if (!location || !location.city || !location.country) {
      setAiInfo('');
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setAiInfo('');
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      const prompt = `You are a helpful weather assistant. Given the following weather data for ${location.city}, ${location.country}, provide a friendly, concise summary and any relevant tips or warnings.\n\nWeather data: ${JSON.stringify(weather)}`;
      fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      })
        .then(res => res.json())
        .then(data => {
          const text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text;
          setAiInfo(text || 'No AI summary available.');
        })
        .catch(() => setError('Failed to fetch AI weather info.'))
        .finally(() => setLoading(false));
    }, 500);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [weather, location]);

  if (!location || !location.city || !location.country) {
    return (
      <aside className="w-full md:w-80 bg-white/90 shadow-lg border-l border-blue-100 p-4 flex flex-col gap-2 sticky top-0 h-fit md:h-screen">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">AI Weather Insights</h2>
        <div className="text-gray-500">Select a location to see AI insights.</div>
      </aside>
    );
  }

  return (
    <aside className="w-full md:w-80 bg-white/90 shadow-lg border-l border-blue-100 p-4 flex flex-col gap-2 sticky top-0 h-fit md:h-screen">
      <h2 className="text-lg font-semibold mb-2 text-blue-700">AI Weather Insights</h2>
      {loading && <div className="text-blue-500">Loading AI summary...</div>}
      {error && <div className="text-red-500" role="alert">{error}</div>}
      {!loading && !error && <div className="text-gray-800 whitespace-pre-line" aria-live="polite">{aiInfo}</div>}
    </aside>
  );
}

export default AISidebar; 