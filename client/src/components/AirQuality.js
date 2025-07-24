import React, { useEffect, useState } from 'react';

const OWM_API_KEY = 'dbce05f0efdc3fd0ba74d01fe3982bf6';

const POLLUTANTS = [
  { key: 'pm2_5', label: 'PM 2.5', desc: 'Fine Particulate Matter – Health Impact', color: 'bg-yellow-300', aqiKey: 'pm2_5' },
  { key: 'pm10', label: 'PM 10', desc: 'Irritation Risk', color: 'bg-orange-300', aqiKey: 'pm10' },
  { key: 'no2', label: 'NO₂', desc: 'Respiratory Effect', color: 'bg-red-300', aqiKey: 'no2' },
  { key: 'o3', label: 'O₃', desc: 'Ozone Level', color: 'bg-green-300', aqiKey: 'o3' },
];

function getAQIColor(aqi) {
  if (aqi === 1) return 'bg-green-200';
  if (aqi === 2) return 'bg-yellow-200';
  if (aqi === 3) return 'bg-orange-200';
  if (aqi === 4) return 'bg-red-200';
  if (aqi === 5) return 'bg-purple-200';
  return 'bg-gray-200';
}

function AirQuality({ location }) {
  const [aq, setAQ] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;
    setLoading(true);
    setError(null);
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${OWM_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (!data.list || !data.list[0]) throw new Error('No air quality data');
        setAQ(data.list[0]);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [location]);

  if (loading) return <div className="text-blue-500">Loading air quality...</div>;
  if (error) return <div className="text-red-500" role="alert">Error: {error}</div>;
  if (!aq) return <div className="text-gray-500">No air quality data.</div>;

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2" aria-live="polite">
      <div className="text-lg font-bold text-blue-700 mb-2">Current Pollutants and Air Quality</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {POLLUTANTS.map(p => (
          <div
            key={p.key}
            className={`rounded p-3 text-center shadow cursor-pointer relative group ${p.color} focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2`}
            title={p.desc}
            tabIndex={0}
            role="button"
            aria-label={`${p.label}: ${aq.components[p.key]} micrograms per cubic meter. ${p.desc}`}
          >
            <div className="text-xl font-bold">{p.label}</div>
            <div className="text-2xl font-bold">{aq.components[p.key]} <span className="text-xs">µg/m³</span></div>
            <div className="text-xs mt-1">{p.desc}</div>
          </div>
        ))}
      </div>
      <div className={`mt-4 p-3 rounded text-center font-semibold ${getAQIColor(aq.main.aqi)}`}>
        AQI: {aq.main.aqi} (1=Good, 5=Very Poor)
      </div>
    </div>
  );
}

export default AirQuality; 