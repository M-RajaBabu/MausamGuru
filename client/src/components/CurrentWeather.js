import React, { useEffect, useState } from 'react';

const OWM_API_KEY = 'dbce05f0efdc3fd0ba74d01fe3982bf6';

function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function CurrentWeather({ location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;
    setLoading(true);
    setError(null);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${OWM_API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        if (data.cod !== 200) throw new Error(data.message);
        setWeather(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [location]);

  if (loading) return <div className="text-blue-500">Loading current weather...</div>;
  if (error) return <div className="text-red-500" role="alert">Error: {error}</div>;
  if (!weather) return <div className="text-gray-500">No weather data.</div>;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  const sunrise = new Date(weather.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString();

  // Calculate distance between selected location and weather station
  let distance = null;
  if (location && location.latitude && location.longitude && weather.coord) {
    distance = haversineDistance(location.latitude, location.longitude, weather.coord.lat, weather.coord.lon);
  }

  const isDifferentLocation = location && weather && (
    (location.city && weather.name && location.city.toLowerCase() !== weather.name.toLowerCase()) ||
    (distance && distance > 2)
  );

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2" aria-live="polite">
      <div className="flex flex-col gap-1 mb-2">
        <div className="text-xs text-blue-700 font-semibold">Selected: {location.city}{location.region ? `, ${location.region}` : ''}, {location.country} (Lat: {location.latitude}, Lon: {location.longitude})</div>
        {isDifferentLocation && (
          <div className="text-xs text-orange-600 font-semibold">
            Weather shown is for the nearest station: {weather.name}, {weather.sys.country}
            {distance && (
              <span> ({distance.toFixed(1)} km away)</span>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <img src={iconUrl} alt={weather.weather[0].description} className="w-16 h-16" />
        <div>
          <div className="text-2xl font-bold text-blue-700">{weather.name}, {weather.sys.country}</div>
          <div className="capitalize text-gray-700">{weather.weather[0].description}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
        <div>🌡️ Temp: <span className="font-semibold">{weather.main.temp}°C</span></div>
        <div>💧 Humidity: <span className="font-semibold">{weather.main.humidity}%</span></div>
        <div>🔽 Min: {weather.main.temp_min}°C</div>
        <div>🔼 Max: {weather.main.temp_max}°C</div>
        <div>🌬️ Wind: {weather.wind.speed} m/s</div>
        <div>🧭 Pressure: {weather.main.pressure} hPa</div>
        <div>🌅 Sunrise: {sunrise}</div>
        <div>🌇 Sunset: {sunset}</div>
      </div>
    </div>
  );
}

export default CurrentWeather; 