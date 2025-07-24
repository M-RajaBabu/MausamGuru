import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;
const FUN_FACTS = [
  'Did you know? The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, USA.',
  'Raindrops can fall at speeds of about 22 miles per hour!',
  'The coldest temperature ever recorded was -89.2°C (-128.6°F) in Antarctica.',
  'A bolt of lightning is five times hotter than the surface of the sun.',
  'The wettest place on Earth is Mawsynram, India, with 11,871mm of rain annually.',
  'Snowflakes can fall at speeds of 1-6 feet per second.',
  'The fastest wind speed ever recorded was 253 mph during Cyclone Olivia in 1996.'
];

function getMoonPhase(phase) {
  if (phase === 0 || phase === 1) return 'New Moon';
  if (phase < 0.25) return 'Waxing Crescent';
  if (phase === 0.25) return 'First Quarter';
  if (phase < 0.5) return 'Waxing Gibbous';
  if (phase === 0.5) return 'Full Moon';
  if (phase < 0.75) return 'Waning Gibbous';
  if (phase === 0.75) return 'Last Quarter';
  return 'Waning Crescent';
}

function getActivitySuggestion(weather) {
  if (!weather) return 'Check the weather for activity suggestions!';
  const desc = weather.weather[0].main.toLowerCase();
  if (desc.includes('rain')) return 'It’s rainy. Great day for indoor activities or reading a book!';
  if (desc.includes('clear')) return 'Clear skies! Perfect for a walk, run, or outdoor sports.';
  if (desc.includes('cloud')) return 'Cloudy but nice for a stroll or light exercise.';
  if (desc.includes('snow')) return 'Snowy day! Try building a snowman or enjoy a hot drink inside.';
  if (desc.includes('storm')) return 'Stormy weather. Best to stay indoors and stay safe!';
  if (weather.main.temp > 32) return 'Very hot! Stay hydrated and avoid strenuous outdoor activity.';
  if (weather.main.temp < 5) return 'Chilly outside. Dress warmly if you go out!';
  return 'Enjoy your day!';
}

function SidebarExtras({ location }) {
  const [trends, setTrends] = useState([]);
  const [weather, setWeather] = useState(null);
  const [astro, setAstro] = useState(null);
  const [factIdx, setFactIdx] = useState(0);

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;
    // Fetch 7-day forecast for trends and astronomy
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&appid=${OWM_API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        if (data.daily) setTrends(data.daily.slice(0, 7));
        if (data.current) setWeather(data.current);
        if (data.daily && data.daily[0]) setAstro(data.daily[0]);
      });
    // Rotate fun fact every 10 seconds
    const interval = setInterval(() => setFactIdx(i => (i + 1) % FUN_FACTS.length), 10000);
    return () => clearInterval(interval);
  }, [location]);

  if (!astro) return null;
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-4">
      <div>
        <div className="font-bold text-blue-700 mb-1">Sunrise, Sunset & Moon</div>
        <div className="text-xs">Sunrise: {new Date(astro.sunrise * 1000).toLocaleTimeString()}</div>
        <div className="text-xs">Sunset: {new Date(astro.sunset * 1000).toLocaleTimeString()}</div>
        <div className="text-xs">Moon Phase: {getMoonPhase(astro.moon_phase)}</div>
      </div>
    </div>
  );
}

export default SidebarExtras; 