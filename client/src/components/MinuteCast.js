import React, { useEffect, useState } from 'react';

const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

function MinuteCast({ location }) {
  const [minutely, setMinutely] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;
    setLoading(true);
    setError(null);
    setMinutely(null);
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${location.latitude}&lon=${location.longitude}&appid=${OWM_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (!data.minutely) throw new Error('Minutely precipitation data not available for this location.');
        setMinutely(data.minutely);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [location]);

  if (loading) return <div className="text-blue-500">Loading MinuteCast...</div>;
  if (error) return <div className="text-red-500" role="alert">{error}</div>;
  if (!minutely) return <div className="text-gray-500">No minutely precipitation data available.</div>;

  const hasPrecip = minutely.some(m => m.precipitation > 0);

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2" aria-live="polite">
      <div className="text-lg font-bold text-blue-700 mb-2">MinuteCast: Next 60 Minutes Precipitation</div>
      {!hasPrecip ? (
        <div className="text-green-600 font-semibold">No precipitation expected in the next hour.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                <th className="px-2 py-1">Minute</th>
                <th className="px-2 py-1">Precipitation (mm)</th>
              </tr>
            </thead>
            <tbody>
              {minutely.map((m, i) => (
                <tr key={i} className={m.precipitation > 0 ? 'bg-blue-50' : ''}>
                  <td className="px-2 py-1">{i === 0 ? 'Now' : `+${i} min`}</td>
                  <td className="px-2 py-1">{m.precipitation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MinuteCast; 