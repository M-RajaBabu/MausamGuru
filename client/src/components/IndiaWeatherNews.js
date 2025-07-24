import React, { useEffect, useState } from 'react';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY;

const STATE_CAPITALS = {
  'Andhra Pradesh': 'Amaravati',
  'Arunachal Pradesh': 'Itanagar',
  'Assam': 'Dispur',
  'Bihar': 'Patna',
  'Chhattisgarh': 'Raipur',
  'Goa': 'Panaji',
  'Gujarat': 'Gandhinagar',
  'Haryana': 'Chandigarh',
  'Himachal Pradesh': 'Shimla',
  'Jharkhand': 'Ranchi',
  'Karnataka': 'Bengaluru',
  'Kerala': 'Thiruvananthapuram',
  'Madhya Pradesh': 'Bhopal',
  'Maharashtra': 'Mumbai',
  'Manipur': 'Imphal',
  'Meghalaya': 'Shillong',
  'Mizoram': 'Aizawl',
  'Nagaland': 'Kohima',
  'Odisha': 'Bhubaneswar',
  'Punjab': 'Chandigarh',
  'Rajasthan': 'Jaipur',
  'Sikkim': 'Gangtok',
  'Tamil Nadu': 'Chennai',
  'Telangana': 'Hyderabad',
  'Tripura': 'Agartala',
  'Uttar Pradesh': 'Lucknow',
  'Uttarakhand': 'Dehradun',
  'West Bengal': 'Kolkata',
  'Andaman and Nicobar Islands': 'Port Blair',
  'Chandigarh': 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu': 'Daman',
  'Delhi': 'Delhi',
  'Jammu and Kashmir': 'Srinagar',
  'Ladakh': 'Leh',
  'Lakshadweep': 'Kavaratti',
  'Puducherry': 'Puducherry',
};

const INDIAN_STATES = Object.keys(STATE_CAPITALS);

function IndiaWeatherNews() {
  const [selectedState, setSelectedState] = useState('Delhi');
  const [weather, setWeather] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch weather and AI summary when state is selected
  useEffect(() => {
    if (!selectedState) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    setAiSummary('');
    const city = STATE_CAPITALS[selectedState];
    // 1. Fetch weather for the capital city
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&appid=${process.env.REACT_APP_OWM_API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        // 2. Ask Gemini for a summary
        const prompt = `Summarize the current weather, top weather news, and any weather alerts for ${selectedState}, India.\n\nWeather data: ${JSON.stringify(data)}`;
        return fetch(GEMINI_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
      })
      .then(res => res && res.json ? res.json() : null)
      .then(data => {
        if (data) {
          const text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text;
          setAiSummary(text || 'No AI summary available.');
        }
      })
      .catch(() => setError('Failed to fetch weather or AI summary.'))
      .finally(() => setLoading(false));
  }, [selectedState]);

  return (
    <aside className="w-full md:w-[420px] bg-white/90 shadow-lg border-l border-blue-100 p-4 flex flex-col gap-2 h-[600px]">
      <h2 className="text-lg font-semibold mb-2 text-blue-700">India: Statewise Weather & Alerts</h2>
      <div className="mb-2 text-xs text-blue-900 font-semibold flex flex-wrap gap-1">
        {INDIAN_STATES.map(state => (
          <button
            key={state}
            className={`bg-blue-100 rounded px-2 py-0.5 mb-1 border focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 ${selectedState === state ? 'border-blue-600 font-bold text-blue-800' : 'border-transparent'}`}
            aria-label={`Select weather for ${state}`}
            onClick={() => setSelectedState(state)}
          >
            {state}
          </button>
        ))}
      </div>
      {selectedState && (
        <div className="mb-2 text-sm text-blue-700 font-semibold">Selected: {selectedState} ({STATE_CAPITALS[selectedState]})</div>
      )}
      {loading && <div className="text-blue-500">Loading weather and news...</div>}
      {error && <div className="text-red-500" role="alert">{error}</div>}
      {!loading && !error && selectedState && weather && weather.weather && weather.weather[0] && (
        <div className="mb-2 p-2 bg-blue-50 rounded" aria-live="polite">
          <div className="font-bold text-blue-700">{weather.name}, {weather.sys && weather.sys.country}</div>
          <div className="text-sm">{weather.weather[0].description}</div>
          <div className="text-lg font-bold">{weather.main.temp}°C</div>
        </div>
      )}
      {!loading && !error && selectedState && aiSummary && aiSummary !== 'No AI summary available.' && (
        <pre className="text-gray-800 whitespace-pre-line text-sm">{aiSummary}</pre>
      )}
      {!selectedState && !loading && !error && (
        <div className="text-gray-500 text-sm">Select a state to see its weather and AI news summary.</div>
      )}
    </aside>
  );
}

export default IndiaWeatherNews; 