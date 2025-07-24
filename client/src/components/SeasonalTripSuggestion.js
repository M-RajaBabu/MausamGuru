import React from 'react';

const SEASONS = [
  {
    name: 'Winter',
    months: [12, 1, 2],
    description: 'Cool and pleasant weather, perfect for exploring most of India.',
    destinations: [
      'Goa (beaches)',
      'Rajasthan (Jaipur, Udaipur, Jaisalmer)',
      'Kerala (backwaters)',
      'Andaman & Nicobar Islands',
      'Rann of Kutch (Gujarat)',
      'Hampi (Karnataka)'
    ],
    tip: 'Ideal time for beach trips, desert festivals, and cultural tours.'
  },
  {
    name: 'Summer',
    months: [3, 4, 5],
    description: 'Hot in most regions, but great for hill stations and the Himalayas.',
    destinations: [
      'Manali & Shimla (Himachal Pradesh)',
      'Darjeeling (West Bengal)',
      'Ooty & Kodaikanal (Tamil Nadu)',
      'Sikkim',
      'Ladakh (Jammu & Kashmir)',
      'Mount Abu (Rajasthan)'
    ],
    tip: 'Escape the heat by heading to the hills and mountains.'
  },
  {
    name: 'Monsoon',
    months: [6, 7, 8, 9],
    description: 'Lush landscapes, heavy rains in many regions. Great for nature lovers.',
    destinations: [
      'Munnar & Wayanad (Kerala)',
      'Coorg (Karnataka)',
      'Meghalaya (Cherrapunji, Shillong)',
      'Valley of Flowers (Uttarakhand)',
      'Lonavala & Mahabaleshwar (Maharashtra)'
    ],
    tip: 'Perfect for scenic drives, waterfalls, and off-season travel deals.'
  },
  {
    name: 'Autumn',
    months: [10, 11],
    description: 'Clear skies, pleasant weather, and festive season in India.',
    destinations: [
      'Varanasi (Dev Deepawali)',
      'Kolkata (Durga Puja)',
      'Agra (Taj Mahal)',
      'Jodhpur (Rajasthan)',
      'Hampi (Karnataka)'
    ],
    tip: 'Great for festivals, heritage sites, and city tours.'
  }
];

function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // JS months are 0-based
  for (const season of SEASONS) {
    if (season.months.includes(month)) return season;
  }
  // Default fallback
  return SEASONS[0];
}

export default function SeasonalTripSuggestion() {
  const season = getCurrentSeason();
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-2xl font-bold text-blue-600">Current Season: {season.name}</div>
      <div className="text-blue-800 text-base mb-2">{season.description}</div>
      <div className="w-full">
        <div className="font-semibold text-blue-700 mb-1">Recommended Destinations:</div>
        <ul className="list-disc pl-6 text-blue-900 mb-2">
          {season.destinations.map(dest => (
            <li key={dest}>{dest}</li>
          ))}
        </ul>
        <div className="italic text-blue-500">{season.tip}</div>
      </div>
    </div>
  );
} 