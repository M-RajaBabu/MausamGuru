import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

function groupByDay(list) {
  const days = {};
  list.forEach(item => {
    const day = new Date(item.dt * 1000).toLocaleDateString();
    if (!days[day]) days[day] = [];
    days[day].push(item);
  });
  return Object.entries(days).map(([day, items]) => ({
    day: new Date(items[0].dt * 1000).toLocaleDateString(undefined, { weekday: 'short' }),
    min: Math.min(...items.map(i => i.main.temp_min)),
    max: Math.max(...items.map(i => i.main.temp_max)),
    rain: items.reduce((sum, i) => sum + (i.rain ? i.rain['3h'] || 0 : 0), 0),
    wind: Math.max(...items.map(i => i.wind.speed)),
    icon: items[0].weather[0].icon,
    desc: items[0].weather[0].description,
  }));
}

function Forecast({ type, location }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [raw, setRaw] = useState(null);

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;
    setLoading(true);
    setError(null);
    setRaw(null);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${OWM_API_KEY}&units=metric`)
      .then(res => res.json())
      .then(json => {
        setRaw(json);
        setData(json);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [location]);

  if (loading) return <div className="text-blue-500">Loading forecast...</div>;
  if (error) return <div className="text-red-500" role="alert">Error: {error}</div>;

  if (!data || !data.list) {
    return <div className="text-gray-500">No forecast data.<br />Raw API response:<br /><pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(raw, null, 2)}</pre></div>;
  }

  // 24-hour forecast (from 3-hourly data)
  if (type === 'hourly') {
    const hourly = data.list.slice(0, 8).map(h => ({
      time: new Date(h.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: h.main.temp,
      wind: h.wind.speed,
      rain: h.rain ? h.rain['3h'] || 0 : 0,
    }));
    return (
      <div className="bg-white rounded shadow p-4" aria-live="polite">
        <div className="text-lg font-bold text-blue-700 mb-2">24-Hour Forecast</div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hourly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'mm', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#2563eb" name="Temp (°C)" />
            <Line yAxisId="left" type="monotone" dataKey="wind" stroke="#f59e42" name="Wind (m/s)" />
            <Bar yAxisId="right" dataKey="rain" fill="#38bdf8" name="Rain (mm)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 5-day forecast (grouped by day)
  if (type === 'daily' || type === 'today' || type === 'monthly') {
    const daily = groupByDay(data.list).slice(0, 5);
    return (
      <div className="bg-white rounded shadow p-4" aria-live="polite">
        <div className="text-lg font-bold text-blue-700 mb-2">5-Day Forecast</div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={daily} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="min" fill="#60a5fa" name="Min Temp (°C)" />
            <Bar dataKey="max" fill="#2563eb" name="Max Temp (°C)" />
            <Bar dataKey="rain" fill="#38bdf8" name="Rain (mm)" />
            <Bar dataKey="wind" fill="#f59e42" name="Wind (m/s)" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {daily.map((d, i) => (
            <div key={i} className="flex flex-col items-center p-2 bg-blue-50 rounded shadow text-xs">
              <img src={`https://openweathermap.org/img/wn/${d.icon}.png`} alt={d.desc} />
              <div className="font-bold">{d.day}</div>
              <div>{d.desc}</div>
              <div>Min: {d.min}°C</div>
              <div>Max: {d.max}°C</div>
              <div>Rain: {d.rain}mm</div>
              <div>Wind: {d.wind}m/s</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div className="text-gray-500">Forecast type not supported.<br />Raw API response:<br /><pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(raw, null, 2)}</pre></div>;
}

export default Forecast; 