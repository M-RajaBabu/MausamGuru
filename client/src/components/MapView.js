import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapUpdater({ center }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

const TILE_LAYERS = {
  Standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  Satellite: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  Dark: 'https://tiles.stadiamaps.com/tiles/alidade_dark/{z}/{x}/{y}{r}.png',
};

function MapView({ location, weather, onMaximize, maximized }) {
  const position = [location.latitude, location.longitude];
  const [popupOpen, setPopupOpen] = React.useState(true);
  const [showRadar, setShowRadar] = React.useState(false);
  const [tileLayer, setTileLayer] = React.useState(TILE_LAYERS.Standard);
  React.useEffect(() => {
    setPopupOpen(true); // Open popup automatically on location/weather change
  }, [location, weather]);

  return (
    <>
      <div className="font-bold text-blue-700 text-lg text-center">Weather View (Leaflet Map)</div>
      {/* Control bar fixed above the map */}
      <div className="sticky top-0 w-full flex justify-center z-40" style={{ zIndex: 40 }}>
        <div className="bg-white/95 rounded-b-xl shadow-lg border border-blue-200 px-3 py-2 flex items-center gap-3 mt-0" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
          <label className="text-xs font-semibold text-blue-700 mr-2" htmlFor="leaflet-style-select">Map Type:</label>
          <select
            id="leaflet-style-select"
            value={tileLayer}
            onChange={e => setTileLayer(e.target.value)}
            className="rounded px-2 py-1 text-xs border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white text-blue-700 shadow-sm focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ minWidth: 120 }}
            aria-label="Map style selector"
          >
            {Object.entries(TILE_LAYERS).map(([label, value]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            className={`px-2 py-1 rounded-full text-xs font-semibold border shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition flex items-center gap-1
              ${showRadar ? 'bg-blue-600 text-white border-blue-700' : 'bg-white/90 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
            style={{ minWidth: 32 }}
            onClick={() => setShowRadar(r => !r)}
            title="Toggle radar overlay"
            aria-label={showRadar ? 'Hide radar overlay' : 'Show radar overlay'}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setShowRadar(r => !r); } }}
          >
            <span className="text-base" role="img" aria-label="Radar">🌧️</span> {showRadar ? 'Hide Radar' : 'Show Radar'}
          </button>
          {onMaximize && (
            <button className="bg-blue-600 text-white rounded-full px-2 py-1 text-base shadow border border-blue-200 flex items-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={onMaximize} title="Maximize map" aria-label="Maximize map view">
              <span className="focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2" role="img" aria-label="Maximize">⛶</span>
            </button>
          )}
        </div>
      </div>
      <div className="bg-white rounded shadow p-0 overflow-hidden relative pb-6 z-10" style={{ height: maximized ? '100%' : 400, minHeight: 400 }}>
        <MapContainer key={`${position[0]},${position[1]}-${tileLayer}`} center={position} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true} aria-label="Interactive weather map">
        <MapUpdater center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileLayer}
          />
          {showRadar && (
            <TileLayer
              attribution='Radar data © OpenWeatherMap'
              url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`}
              opacity={0.7}
        />
          )}
        <Marker position={position} icon={customIcon} aria-label="Selected location marker">
            <Popup open={popupOpen} onClose={() => setPopupOpen(false)} aria-label="Weather popup" role="dialog">
              <div>
                <div className="font-bold text-blue-700">{location.city}, {location.country}</div>
                {weather && weather.weather && weather.weather[0] && (
                  <>
                    <div className="text-sm">{weather.weather[0].description}</div>
                    <div className="text-lg font-bold">{weather.main.temp}°C</div>
                  </>
                )}
              </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
      {/* Button bar below the map */}
    </>
  );
}

export default MapView; 