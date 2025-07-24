import React, { useEffect, useState } from 'react';

const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

const generalTips = [
  { tip: 'Stay hydrated! 💧', condition: () => true },
  { tip: 'Check the weather before heading out. 🌦️', condition: () => true },
  { tip: 'Dress in layers for changing weather. 🧥', condition: () => true },
  { tip: 'Keep emergency supplies handy during storms. ⛈️', condition: weather => weather && weather.weather && weather.weather[0].main === 'Thunderstorm' },
  { tip: 'Use sunscreen when UV is moderate or higher. 🧴', condition: uv => uv >= 3 },
  { tip: 'Limit outdoor activity when air quality is poor. 😷', condition: aqi => aqi >= 4 },
  { tip: 'Wear a hat and sunglasses for sun protection. 🕶️', condition: uv => uv >= 3 },
  { tip: 'Avoid strenuous activity during high heat. ☀️', condition: weather => weather && weather.main && weather.main.temp >= 30 },
  { tip: 'Check pollen levels if you have allergies. 🌸', condition: () => true },
  { tip: 'Children and elderly should take extra care in extreme weather. 👶👵', condition: weather => weather && (weather.main.temp >= 32 || weather.main.temp <= 0) },
  { tip: 'Carry an umbrella if rain is expected. ☔', condition: weather => weather && weather.weather && weather.weather[0].main === 'Rain' },
  { tip: 'Drive carefully in foggy conditions. 🌫️', condition: weather => weather && weather.weather && weather.weather[0].main === 'Fog' },
  { tip: 'Wear waterproof shoes in wet weather. 🥾', condition: weather => weather && (weather.weather && (weather.weather[0].main === 'Rain' || weather.weather[0].main === 'Drizzle')) },
  { tip: 'Watch for icy sidewalks in freezing weather. 🧊', condition: weather => weather && weather.main && weather.main.temp <= 0 },
  { tip: 'Bundle up in cold weather. 🧣', condition: weather => weather && weather.main && weather.main.temp <= 5 },
  { tip: 'Use moisturizer to protect skin in dry air. 🧴', condition: weather => weather && weather.main && weather.main.humidity < 30 },
  { tip: 'Open windows to reduce indoor humidity. 🪟', condition: weather => weather && weather.main && weather.main.humidity > 70 },
  { tip: 'Secure loose objects outdoors in high winds. 💨', condition: weather => weather && weather.wind && weather.wind.speed >= 10 },
  { tip: 'Wear a mask if pollen or pollution is high. 😷', condition: (aqi, uv, weather, pollen) => (aqi && aqi >= 4) || (pollen && pollen > 2) },
  { tip: 'Shovel snow carefully to avoid injury. ❄️', condition: weather => weather && weather.weather && weather.weather[0].main === 'Snow' },
  { tip: 'Check for weather alerts in your area. 🚨', condition: () => true },
  { tip: 'Let someone know your route if hiking or biking. 🚴', condition: () => true },
  { tip: 'Stay indoors during severe weather warnings. 🏠', condition: weather => weather && weather.weather && ['Thunderstorm', 'Tornado', 'Squall'].includes(weather.weather[0].main) },
  { tip: 'Keep pets safe and hydrated in hot weather. 🐶', condition: weather => weather && weather.main && weather.main.temp >= 30 },
  { tip: 'Avoid walking under trees during strong winds. 🌳', condition: weather => weather && weather.wind && weather.wind.speed >= 15 },
  { tip: 'Use hand warmers in very cold weather. 🔥', condition: weather => weather && weather.main && weather.main.temp <= -5 },
  { tip: 'Wear bright clothing in fog or low visibility. 👕', condition: weather => weather && weather.weather && ['Fog', 'Mist', 'Haze'].includes(weather.weather[0].main) },
  { tip: 'Check local news for updates during storms. 📻', condition: weather => weather && weather.weather && ['Thunderstorm', 'Tornado', 'Squall'].includes(weather.weather[0].main) },
];

function HelpfulTips({ location }) {
  const [uv, setUv] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;
    // Fetch UV, AQI, and weather in parallel
    Promise.all([
      fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${location.latitude}&lon=${location.longitude}&appid=${OWM_API_KEY}`)
        .then(res => res.json()),
      fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${OWM_API_KEY}`)
        .then(res => res.json()),
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${OWM_API_KEY}&units=metric`)
        .then(res => res.json())
    ]).then(([oneCall, air, weatherData]) => {
      setUv(oneCall.current && typeof oneCall.current.uvi === 'number' ? oneCall.current.uvi : null);
      setAqi(air.list && air.list[0] && air.list[0].main && air.list[0].main.aqi ? air.list[0].main.aqi : null);
      setWeather(weatherData && weatherData.weather ? weatherData : null);
    });
  }, [location]);

  // Filter tips based on current conditions
  const tips = generalTips.filter(t => {
    if (t.condition.length === 0) return true;
    if (t.condition.length === 1) {
      // For UV or AQI only
      if (uv !== null && t.condition === generalTips[4].condition) return t.condition(uv);
      if (aqi !== null && t.condition === generalTips[5].condition) return t.condition(aqi);
      if (uv !== null && t.condition === generalTips[6].condition) return t.condition(uv);
      return t.condition(weather);
    }
    // For tips with more than one argument (e.g., pollen)
    return t.condition(aqi, uv, weather, null);
  });

  return (
    <>
      <h2 className="text-lg font-semibold mb-2 text-blue-700">Helpful Tips</h2>
      <ul className="list-disc pl-5 text-gray-700 space-y-1">
        {tips.map((t, i) => <li key={i}>{t.tip}</li>)}
      </ul>
    </>
  );
}

export default HelpfulTips; 