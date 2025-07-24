import React, { useEffect, useState } from 'react';

const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

function HourlyForecast({ location }) {
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;
    setLoading(true);
    setError(null);
    setHourly([]);
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&appid=${OWM_API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        if (data.hourly) setHourly(data.hourly.slice(0, 12));
        else setError('No hourly data available.');
      })
      .catch(() => setError('Failed to fetch hourly forecast.'))
      .finally(() => setLoading(false));
  }, [location]);

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2" aria-live="polite">
      <div className="font-bold text-blue-700 mb-2">Hourly Forecast (Next 12 Hours)</div>
      {loading && <div className="text-blue-500">Loading...</div>}
      {error && <div className="text-red-500" role="alert">{error}</div>}
      {!loading && !error && hourly.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {hourly.map((h, i) => (
            <div key={i} className="flex flex-col items-center min-w-[60px]">
              <div className="text-xs text-gray-500 mb-1">{new Date(h.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <img src={`https://openweathermap.org/img/wn/${h.weather[0].icon}.png`} alt={h.weather[0].description} className="w-8 h-8" />
              <div className="text-sm font-bold text-blue-700">{Math.round(h.temp)}°C</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HourlyForecast; 