import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import MapView from './components/MapView';
import MapboxMap from './components/MapboxMap';
import CurrentWeather from './components/CurrentWeather';
import AirQuality from './components/AirQuality';
import Forecast from './components/Forecast';
import MinuteCast from './components/MinuteCast';
import HealthActivities from './components/HealthActivities';
import HelpfulTips from './components/HelpfulTips';
import AISidebar from './components/AISidebar';
import IndiaWeatherNews from './components/IndiaWeatherNews';
import SidebarExtras from './components/SidebarExtras';
import HourlyForecast from './components/HourlyForecast';
import SeasonalTripSuggestion from './components/SeasonalTripSuggestion';

const TABS = [
  'Now', 'Radar', 'Air Quality', 'Health & Activities', 'Mapbox View', 'Leaflet Map', 'Seasons', 'Contact Us'
];

function App() {
  const [activeTab, setActiveTab] = useState('Now');
  const [selectedLocation, setSelectedLocation] = useState({
    city: 'New Delhi',
    country: 'IN',
    latitude: 28.6139,
    longitude: 77.2090,
  });
  const [sidebarWeather, setSidebarWeather] = useState(null);
  const [maximizedMap, setMaximizedMap] = useState(null); // 'leaflet' or 'mapbox' or null
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [mapWeather, setMapWeather] = useState(null);
  const [maximizedRadar, setMaximizedRadar] = useState(false);

  useEffect(() => {
    if (!selectedLocation || !selectedLocation.latitude || !selectedLocation.longitude) return;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${selectedLocation.latitude}&lon=${selectedLocation.longitude}&appid=dbce05f0efdc3fd0ba74d01fe3982bf6&units=metric`)
      .then(res => res.json())
      .then(data => setMapWeather(data))
      .catch(() => setMapWeather(null));
  }, [selectedLocation]);

  // Secondary forecast tabs
  const FORECAST_TABS = ['Today', 'Hourly', 'Daily', 'MinuteCast', 'Monthly'];
  const isForecastTab = FORECAST_TABS.includes(activeTab);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 animate-gradient-x flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-blue-700 text-white px-4 py-2 rounded z-50">Skip to main content</a>
      {/* Hero Section */}
      <header className="sticky top-0 z-50 w-full flex flex-col items-center justify-center py-6 sm:py-10 md:py-16 text-center bg-gradient-to-br from-blue-400/80 to-blue-700/80 shadow-lg border-b border-blue-200/30">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-2 sm:mb-4 animate-fade-in">MausamGuru</h1>
        <p className="text-base sm:text-xl md:text-2xl text-blue-100 mb-2 sm:mb-6 animate-fade-in delay-100 flex items-center justify-center gap-2">
          Aapka Mausam Saathi
          <img
            src="https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/in.svg"
            alt="Indian flag"
            className="inline-block w-6 h-4 sm:w-8 sm:h-5 align-middle"
          />
        </p>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-20 pointer-events-none rounded-b-3xl" />
      </header>

      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/60 shadow-xl sticky top-[72px] sm:top-[96px] z-40 border-b border-blue-200/30" role="navigation" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 flex flex-wrap items-center justify-between rounded-b-2xl">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-800 drop-shadow-sm font-sans select-none" style={{letterSpacing: '0.04em'}}>MausamGuru</span>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0 overflow-x-auto sm:overflow-x-visible scrollbar-thin scrollbar-thumb-blue-200" role="tablist" aria-label="Main Tabs" style={{WebkitOverflowScrolling:'touch'}}>
            <button
              className={`px-4 sm:px-5 py-2 rounded-2xl font-semibold whitespace-nowrap transition-all duration-200 border border-transparent shadow-sm focus:outline-none focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus:ring-2 focus:ring-blue-400/40
                ${isForecastTab
                  ? 'bg-gradient-to-r from-blue-700 to-blue-400 text-white scale-105 shadow-lg border-blue-400'
                  : 'bg-white/70 text-blue-800 hover:bg-blue-100 hover:scale-105'}`}
              onClick={() => setActiveTab('Today')}
              style={{ minWidth: 100, fontFamily: 'Inter, Segoe UI, Arial, sans-serif', fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.02em' }}
              title="Forecast"
              role="tab"
              aria-selected={isForecastTab}
              aria-label="Forecast Tab"
            >
              <span className="flex items-center gap-2 justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m6.364 1.636l-1.414 1.414M21 12h-2M17.657 17.657l-1.414-1.414M12 21v-2M6.343 17.657l1.414-1.414M3 12h2m1.636-6.364l1.414 1.414M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Forecast
              </span>
            </button>
            {TABS.map(tab => (
              <button
                key={tab}
                className={`px-4 sm:px-5 py-2 rounded-2xl font-semibold whitespace-nowrap transition-all duration-200 border border-transparent shadow-sm focus:outline-none focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus:ring-2 focus:ring-blue-400/40
                  ${activeTab === tab
                    ? 'bg-gradient-to-r from-blue-700 to-blue-400 text-white scale-105 shadow-lg border-blue-400'
                    : 'bg-white/70 text-blue-800 hover:bg-blue-100 hover:scale-105'}`}
                onClick={() => setActiveTab(tab)}
                style={{ minWidth: 100, fontFamily: 'Inter, Segoe UI, Arial, sans-serif', fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.02em' }}
                role="tab"
                aria-selected={activeTab === tab}
                aria-label={`${tab} Tab`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-1 sm:px-2 md:px-4 py-2 sm:py-8 pt-[140px] sm:pt-24" tabIndex={-1} aria-label="Main content">
        {isForecastTab && (
          <>
            <div className="text-xl font-bold text-blue-700 mb-2">{selectedLocation.city}, {selectedLocation.country}</div>
            <div className="flex gap-2 mb-6">
              {FORECAST_TABS.map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 border border-transparent shadow-sm focus:outline-none focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus:ring-2 focus:ring-blue-400/40
                    ${activeTab === tab
                      ? 'bg-gradient-to-r from-blue-700 to-blue-400 text-white scale-105 shadow-lg border-blue-400'
                      : 'bg-white/70 text-blue-800 hover:bg-blue-100 hover:scale-105'}`}
                  onClick={() => setActiveTab(tab)}
                  style={{ minWidth: 90, fontFamily: 'Inter, Segoe UI, Arial, sans-serif', fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.02em' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </>
        )}
        {activeTab === 'Now' && (
          <>
            {/* Sticky search bar on mobile, normal on desktop */}
            <div className="block sm:hidden sticky top-[120px] z-30 bg-white/95 border-b border-blue-100 shadow-sm px-2 py-2 rounded-b-xl">
              <Search onSelect={place => setSelectedLocation({
                city: place.city,
                country: place.country,
                region: place.region || '',
                latitude: place.latitude,
                longitude: place.longitude,
              })} />
            </div>
            <div className="hidden sm:block max-w-7xl mx-auto w-full px-2 sm:px-4 mb-8">
              <Search onSelect={place => setSelectedLocation({
                city: place.city,
                country: place.country,
                region: place.region || '',
                latitude: place.latitude,
                longitude: place.longitude,
              })} />
            </div>
            <section className="flex flex-col md:flex-row gap-4 md:gap-8 items-stretch w-full">
              <div className="flex-1 w-full min-w-0 flex flex-col gap-4 md:gap-6">
                <NowMaps 
                  selectedLocation={selectedLocation}
                  weather={mapWeather}
                  onWeather={setSidebarWeather}
                  onMaximize={setMaximizedMap}
                />
                {/* Today's Weather Tip card directly below the maps */}
                <div className="bg-white rounded shadow p-6 w-full flex flex-col items-center mt-2">
                  <div className="font-bold text-blue-700 mb-2">Today's Weather Tip</div>
                  <div className="text-blue-900 italic text-center">Raindrops can fall at speeds of about 22 miles per hour!</div>
                </div>
                {/* Weekly Weather Outlook card below the tip card */}
                <div className="bg-white rounded shadow p-6 w-full flex flex-col items-center mt-2">
                  <div className="font-bold text-blue-700 mb-2">Weekly Weather Outlook</div>
                  <div className="w-full flex flex-col gap-2">
                    {[
                      { day: 'Mon', min: 24, max: 32, desc: 'Sunny', icon: '☀️' },
                      { day: 'Tue', min: 25, max: 33, desc: 'Partly Cloudy', icon: '⛅' },
                      { day: 'Wed', min: 23, max: 31, desc: 'Rain Showers', icon: '🌦️' },
                      { day: 'Thu', min: 22, max: 30, desc: 'Thunderstorm', icon: '⛈️' },
                      { day: 'Fri', min: 24, max: 32, desc: 'Sunny', icon: '☀️' },
                      { day: 'Sat', min: 25, max: 34, desc: 'Hot', icon: '🌡️' },
                      { day: 'Sun', min: 23, max: 31, desc: 'Cloudy', icon: '☁️' },
                    ].map((d, i) => (
                      <div key={i} className="flex items-center gap-4 w-full border-b last:border-b-0 py-2">
                        <div className="w-12 font-bold text-blue-700">{d.day}</div>
                        <div className="text-2xl">{d.icon}</div>
                        <div className="flex-1 text-blue-900">{d.desc}</div>
                        <div className="text-sm text-gray-600">{d.min}°C / {d.max}°C</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full md:max-w-[420px] flex flex-col gap-4 md:gap-6 h-fit md:h-auto shrink-0">
                <div className="mb-6 md:mb-8"><CurrentWeather location={selectedLocation} /></div>
                <div className="mb-6 md:mb-8"><AirQuality location={selectedLocation} /></div>
                <div className="mb-6 md:mb-8"><IndiaWeatherNews /></div>
                {/* Removed SidebarExtras and image from sidebar */}
              </div>
            </section>
            {/* New container below maps/sidebar for Sunrise/Sunset/Moon only */}
            <section className="max-w-7xl mx-auto w-full px-2 sm:px-4 flex flex-col md:flex-row gap-4 md:gap-6 items-stretch justify-center mt-2 mb-8">
              <div className="flex-1 flex items-center justify-center">
                <SidebarExtras location={selectedLocation} />
              </div>
          </section>
            {maximizedMap && (
              <MapMaximizeModal
                mapType={maximizedMap}
                location={selectedLocation}
                weather={mapWeather}
                onClose={() => setMaximizedMap(null)}
                onSearch={place => setSelectedLocation({
                  city: place.city,
                  country: place.country,
                  region: place.region || '',
                  latitude: place.latitude,
                  longitude: place.longitude,
                })}
              />
            )}
          </>
        )}
        {activeTab === 'Today' && <Forecast type="today" location={selectedLocation} />}
        {activeTab === 'Hourly' && <Forecast type="hourly" location={selectedLocation} />}
        {activeTab === 'Daily' && <Forecast type="daily" location={selectedLocation} />}
        {activeTab === 'MinuteCast' && <MinuteCast location={selectedLocation} />}
        {activeTab === 'Monthly' && <Forecast type="monthly" location={selectedLocation} />}
        {activeTab === 'Radar' && (
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center w-full max-w-5xl mx-auto my-8 overflow-hidden relative">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 text-center">Live Weather Radar</h2>
            <div className="w-full rounded-xl overflow-hidden mb-4 relative" style={{maxWidth: '100%'}}>
              {/* Maximize button */}
              <button
                className="absolute top-2 right-2 z-20 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-200"
                title="Maximize radar"
                onClick={() => setMaximizedRadar(true)}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                {/* Maximize SVG icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
                </svg>
              </button>
              <iframe
                title="RainViewer Radar"
                src={`https://www.rainviewer.com/map.html?loc=${selectedLocation.latitude},${selectedLocation.longitude},7&oFa=0&oC=0&oU=0&oCS=1&oF=0&oAP=0&oAR=0&oBR=1&oCL=1&oMM=1`}
                width="100%"
                height="300"
                className="rounded-xl w-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px]"
                style={{ border: 'none', maxWidth: '100%' }}
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-xs text-blue-400 mt-2 text-center">Radar data by <a href='https://www.rainviewer.com/' target='_blank' rel='noopener noreferrer' className='underline'>RainViewer</a></div>
            {/* Radar Maximize Modal */}
            {maximizedRadar && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-2 sm:px-6">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[80vh] flex flex-col relative pt-4">
                  <button className="absolute top-2 right-2 bg-blue-600 text-white rounded px-3 py-1 z-10 flex items-center justify-center text-xl sm:text-2xl" onClick={() => setMaximizedRadar(false)} title="Minimize radar">
                    &times;
                  </button>
                  <div className="flex-1 flex items-center justify-center">
                    <iframe
                      title="RainViewer Radar (Maximized)"
                      src={`https://www.rainviewer.com/map.html?loc=${selectedLocation.latitude},${selectedLocation.longitude},7&oFa=0&oC=0&oU=0&oCS=1&oF=0&oAP=0&oAR=0&oBR=1&oCL=1&oMM=1`}
                      width="100%"
                      height="100%"
                      className="rounded-xl w-full h-[50vh] sm:h-[70vh]"
                      style={{ border: 'none', maxWidth: '100%' }}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'Air Quality' && (
          <>
            <div className="text-xl font-bold text-blue-700 mb-4">{selectedLocation.city}, {selectedLocation.country}</div>
            <AirQuality location={selectedLocation} detailed />
          </>
        )}
        {activeTab === 'Health & Activities' && <HealthActivities location={selectedLocation} />}
        {activeTab === 'Mapbox View' && (
          <MapboxMap location={selectedLocation} weather={mapWeather} onMaximize={() => setMaximizedMap('mapbox')} maximized={false} />
        )}
        {activeTab === 'Leaflet Map' && (
          <MapView location={selectedLocation} weather={mapWeather} onMaximize={() => setMaximizedMap('leaflet')} maximized={false} />
        )}
        {maximizedMap && (
          <MapMaximizeModal
            mapType={maximizedMap}
            location={selectedLocation}
            weather={mapWeather}
            onClose={() => setMaximizedMap(null)}
            onSearch={place => setSelectedLocation({
              city: place.city,
              country: place.country,
              region: place.region || '',
              latitude: place.latitude,
              longitude: place.longitude,
            })}
          />
        )}
        {activeTab === 'Seasons' && (
          <section className="max-w-5xl mx-auto bg-white rounded-xl shadow p-4 md:p-8 mt-12 flex flex-col md:flex-row items-center gap-8 mb-8 overflow-hidden">
            <div className="flex-1 flex justify-center items-center mb-6 md:mb-0">
              <img src="/india go.png" alt="India" className="w-[340px] md:w-[480px] max-w-full h-auto rounded-xl shadow-xl border-4 border-white" />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-3xl font-bold text-blue-700 mb-4">Seasons in India</h2>
              <SeasonalTripSuggestion />
            </div>
          </section>
        )}
        {activeTab === 'Contact Us' && (
          <section className="max-w-2xl mx-auto bg-white rounded shadow p-8 mt-12 flex flex-col items-center gap-4">
            <h2 className="text-3xl font-bold text-blue-700 mb-2">Contact Us</h2>
            <div className="text-lg text-blue-800">For feedback, collaboration, or questions:</div>
            <div className="flex flex-col gap-2 items-center">
              <a href="https://www.linkedin.com/in/rajababumeena/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg">LinkedIn: Raja Babu Meena</a>
              <a href="mailto:rajababumeena0010@gmail.com" className="text-blue-600 hover:underline text-lg">Email: rajababumeena0010@gmail.com</a>
            </div>
          </section>
        )}
      </main>

      {/* Helpful Tips Section */}
      <aside className="bg-white/90 py-4 px-4 shadow-inner border-t border-blue-100">
        <div className="max-w-4xl mx-auto">
          <HelpfulTips location={selectedLocation} />
        </div>
      </aside>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-4 mt-8 shadow-inner">
        <div className="flex flex-col items-center gap-2">
          <span>MausamGuru: Aapka Mausam Saathi
            <img
              src="https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/in.svg"
              alt="Indian flag"
              style={{ display: 'inline', width: '1.5em', height: '1em', marginLeft: '0.5em', verticalAlign: 'middle' }}
            />
          </span>
          <span className="text-xs text-blue-200">Powered by OpenWeatherMap, Leaflet, and GeoDB</span>
        </div>
      </footer>
      {/* Creator Badge */}
      <div className="fixed bottom-4 right-4 z-50 bg-white/90 border border-blue-200 rounded shadow px-4 py-2 flex items-center gap-2 text-xs text-blue-700">
        Project by <span className="font-bold">Raja Babu Meena</span>
        <a href="https://www.linkedin.com/in/rajababumeena/" target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline">LinkedIn</a>
      </div>
    </div>
  );
}

function NowMaps({ selectedLocation, weather, onWeather, onMaximize }) {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="w-full min-h-[300px] md:min-h-[400px] md:max-h-[60vh]">
        <MapboxMap location={selectedLocation} weather={weather} onMaximize={() => onMaximize && onMaximize('mapbox')} />
      </div>
      <div className="w-full min-h-[300px] md:min-h-[400px] md:max-h-[60vh]">
        <MapView location={selectedLocation} weather={weather} onMaximize={() => onMaximize && onMaximize('leaflet')} />
      </div>
    </div>
  );
}

function MapMaximizeModal({ mapType, location, weather, onClose, onSearch }) {
  const [show, setShow] = useState(true);
  const closeBtnRef = React.useRef();
  const lastActiveElement = React.useRef(null);
  useEffect(() => {
    lastActiveElement.current = document.activeElement;
    setShow(true);
    setTimeout(() => {
      if (closeBtnRef.current) closeBtnRef.current.focus();
    }, 0);
  }, [mapType, location]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" role="dialog" aria-modal="true" aria-label="Map maximize modal">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[80vh] flex flex-col relative pt-4">
        <button ref={closeBtnRef} className="absolute top-2 right-2 bg-blue-600 text-white rounded px-3 py-1 z-10 flex items-center justify-center" onClick={() => { setShow(false); onClose(); setTimeout(() => { if (lastActiveElement.current) lastActiveElement.current.focus(); }, 0); }} title="Minimize map" aria-label="Close map maximize modal">
          ×
        </button>
        <div className="p-4 border-b flex items-center gap-4">
          <Search onSelect={onSearch} />
        </div>
        <div className="flex-1 flex min-h-0">
          {mapType === 'leaflet' ? (
            <div className="flex-1 min-h-0"><MapView location={location} weather={weather} maximized /></div>
          ) : (
            <div className="flex-1 min-h-0"><MapboxMap location={location} weather={weather} maximized /></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
