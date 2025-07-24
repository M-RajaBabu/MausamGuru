import React, { useEffect, useState } from 'react';

const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

function getUVLevel(uvi) {
  if (uvi < 3) return { level: 'Low', color: 'bg-green-200', advice: 'Safe for most activities.' };
  if (uvi < 6) return { level: 'Moderate', color: 'bg-yellow-200', advice: 'Wear sunglasses and sunscreen.' };
  if (uvi < 8) return { level: 'High', color: 'bg-orange-200', advice: 'Reduce time in the sun between 10 a.m. and 4 p.m.' };
  if (uvi < 11) return { level: 'Very High', color: 'bg-red-200', advice: 'Minimize sun exposure, wear protective clothing.' };
  return { level: 'Extreme', color: 'bg-purple-200', advice: 'Avoid being outside during midday hours.' };
}

function getAQILevel(aqi) {
  if (aqi === 1) return { level: 'Good', color: 'bg-green-200', advice: 'Air quality is satisfactory.' };
  if (aqi === 2) return { level: 'Fair', color: 'bg-yellow-200', advice: 'Air quality is acceptable.' };
  if (aqi === 3) return { level: 'Moderate', color: 'bg-orange-200', advice: 'Sensitive groups should limit outdoor exertion.' };
  if (aqi === 4) return { level: 'Poor', color: 'bg-red-200', advice: 'Limit prolonged outdoor exertion.' };
  if (aqi === 5) return { level: 'Very Poor', color: 'bg-purple-200', advice: 'Avoid outdoor activities.' };
  return { level: 'Unknown', color: 'bg-gray-200', advice: 'No data.' };
}

const staticTips = [
  'Stay hydrated, especially during hot weather.',
  'Check pollen levels if you have allergies.',
  'Wear a hat and sunglasses for sun protection.',
  'Avoid outdoor exercise during high pollution or extreme heat.',
  'Use sunscreen with SPF 30+ when UV is moderate or higher.',
  'Children, elderly, and those with respiratory issues should take extra care.'
];

const mockPollen = {
  level: 'Moderate',
  advice: 'Pollen count is moderate. Allergy sufferers should take precautions.'
};

const mockMosquito = {
  risk: 'High',
  advice: 'Mosquito activity is high. Use repellents and wear long sleeves.'
};

const mockActivityCalendar = [
  { day: 'Mon', suggestion: 'Morning walk, Yoga' },
  { day: 'Tue', suggestion: 'Cycling, Indoor workout' },
  { day: 'Wed', suggestion: 'Jogging, Meditation' },
  { day: 'Thu', suggestion: 'Swimming, Stretching' },
  { day: 'Fri', suggestion: 'Evening walk, Dance' },
  { day: 'Sat', suggestion: 'Hiking, Sports' },
  { day: 'Sun', suggestion: 'Rest, Family time' },
];

const mockHealthAlerts = [
  'Heatwave alert: Stay indoors during peak afternoon hours.',
  'High pollution: Sensitive groups should avoid outdoor activity.'
];

const mockWellnessChallenges = [
  'Drink at least 2L of water today.',
  'Take 10,000 steps.',
  'Try a 5-minute meditation.'
];

function getActivitySuggestion(uvi, aqi) {
  if (aqi >= 4) return { text: 'Indoor activities recommended due to poor air quality.', icon: '🏠', color: 'bg-red-100 text-red-700' };
  if (uvi >= 8) return { text: 'Avoid outdoor activities during midday; try early morning or evening walks.', icon: '🌞', color: 'bg-orange-100 text-orange-700' };
  if (aqi <= 2 && uvi < 6) return { text: 'Great day for outdoor activities!', icon: '🏃‍♂️', color: 'bg-green-100 text-green-700' };
  return { text: 'Check conditions before planning outdoor activities.', icon: 'ℹ️', color: 'bg-blue-100 text-blue-700' };
}

function HealthActivities({ location }) {
  const [uvi, setUvi] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;
    setLoading(true);
    setError(null);
    setUvi(null);
    setAqi(null);
    // Fetch UV index and AQI in parallel
    Promise.all([
      fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${location.latitude}&lon=${location.longitude}&appid=${OWM_API_KEY}`)
        .then(res => res.json()),
      fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${OWM_API_KEY}`)
        .then(res => res.json())
    ])
      .then(([oneCall, air]) => {
        setUvi(oneCall.current && typeof oneCall.current.uvi === 'number' ? oneCall.current.uvi : null);
        setAqi(air.list && air.list[0] && air.list[0].main && air.list[0].main.aqi ? air.list[0].main.aqi : null);
      })
      .catch(err => setError('Could not fetch health data.'))
      .finally(() => setLoading(false));
  }, [location]);

  if (loading) return <div className="text-blue-500">Loading Health & Activities...</div>;
  if (error) return <div className="text-red-500" role="alert">{error}</div>;

  const uv = uvi !== null ? getUVLevel(uvi) : null;
  const air = aqi !== null ? getAQILevel(aqi) : null;
  const activitySuggestion = (uvi !== null && aqi !== null)
    ? getActivitySuggestion(uvi, aqi)
    : null;

  return (
    <div className="bg-white rounded shadow p-6 flex flex-col gap-6" aria-live="polite">
      <div className="text-2xl font-bold text-blue-700 mb-2">Health & Activities</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UV Index & Air Quality */}
        <div className="p-4 rounded shadow border border-blue-100 flex flex-col gap-2 bg-blue-50">
          <div className="font-semibold mb-1 text-blue-800">UV Index</div>
          {uv ? (
            <div className={`p-2 rounded font-bold ${uv.color}`}>UV Index: {uvi} ({uv.level})<br /><span className="font-normal text-xs">{uv.advice}</span></div>
          ) : (
            <div className="text-gray-500">No UV data available.</div>
          )}
        </div>
        <div className="p-4 rounded shadow border border-blue-100 flex flex-col gap-2 bg-blue-50">
          <div className="font-semibold mb-1 text-blue-800">Air Quality</div>
          {air ? (
            <div className={`p-2 rounded font-bold ${air.color}`}>AQI: {aqi} ({air.level})<br /><span className="font-normal text-xs">{air.advice}</span></div>
          ) : (
            <div className="text-gray-500">No air quality data available.</div>
          )}
        </div>
        {/* Pollen/Allergy Info */}
        <div className="p-4 rounded shadow border border-blue-100 flex flex-col gap-2">
          <div className="font-semibold mb-1 text-green-700">Pollen & Allergy</div>
          <div className="font-bold">Level: {mockPollen.level}</div>
          <div className="text-xs text-green-800">{mockPollen.advice}</div>
        </div>
        {/* Mosquito Risk */}
        <div className="p-4 rounded shadow border border-blue-100 flex flex-col gap-2">
          <div className="font-semibold mb-1 text-yellow-700">Mosquito/Dengue Risk</div>
          <div className="font-bold">Risk: {mockMosquito.risk}</div>
          <div className="text-xs text-yellow-800">{mockMosquito.advice}</div>
        </div>
      </div>
      {/* Activity Suggestion & Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded shadow border border-blue-100 flex flex-col gap-2 bg-blue-50">
          <div className="font-semibold mb-1 text-blue-800">Today's Activity Suggestion</div>
          {activitySuggestion ? (
            <div className={`flex items-center gap-2 font-bold rounded px-3 py-2 ${activitySuggestion.color}`}>
              <span className="text-2xl">{activitySuggestion.icon}</span>
              <span>{activitySuggestion.text}</span>
            </div>
          ) : (
            <div className="text-gray-500">No activity suggestion available for current conditions.</div>
          )}
        </div>
        <div className="p-4 rounded shadow border border-blue-100 flex flex-col gap-2 bg-blue-50">
          <div className="font-semibold mb-1 text-blue-800">Activity Calendar</div>
          <div className="flex flex-wrap gap-2">
            {mockActivityCalendar.map(day => (
              <div key={day.day} className="bg-blue-100 rounded px-3 py-2 text-xs font-semibold text-blue-800 shadow-sm focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2" tabIndex={0} role="button" aria-label={`Activity for ${day.day}: ${day.suggestion}`}>
                <div className="font-bold text-blue-700">{day.day}</div>
                <div>{day.suggestion}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Health Alerts & Wellness Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded shadow border border-blue-100 flex flex-col gap-2">
          <div className="font-semibold mb-1 text-red-700">Health Alerts</div>
          <ul className="list-disc pl-5 text-red-700 space-y-1">
            {mockHealthAlerts.map((alert, i) => <li key={i} tabIndex={0} role="alert" aria-label={`Health alert: ${alert}`} className="focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2">{alert}</li>)}
          </ul>
        </div>
        <div className="p-4 rounded shadow border border-blue-100 flex flex-col gap-2">
          <div className="font-semibold mb-1 text-indigo-700">Wellness Challenges</div>
          <ul className="list-disc pl-5 text-indigo-700 space-y-1">
            {mockWellnessChallenges.map((challenge, i) => <li key={i} tabIndex={0} role="listitem" aria-label={`Wellness challenge: ${challenge}`} className="focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2">{challenge}</li>)}
          </ul>
        </div>
      </div>
      {/* General Tips */}
      <div className="p-4 rounded shadow border border-blue-100 bg-blue-50">
        <div className="font-semibold mb-1">General Health & Activity Tips</div>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          {staticTips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default HealthActivities; 