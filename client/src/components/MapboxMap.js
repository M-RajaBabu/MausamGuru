import React, { useRef, useEffect, useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Search from './Search';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const MAP_STYLES = {
  Satellite: 'mapbox://styles/mapbox/satellite-v9',
  Streets: 'mapbox://styles/mapbox/streets-v11',
  Outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  Light: 'mapbox://styles/mapbox/light-v10',
  Dark: 'mapbox://styles/mapbox/dark-v10',
  Navigation: 'mapbox://styles/mapbox/navigation-day-v1',
  'Traffic Day': 'mapbox://styles/mapbox/traffic-day-v2',
  'Traffic Night': 'mapbox://styles/mapbox/traffic-night-v2',
  'Globe (3D) - Streets': 'mapbox://styles/mapbox/streets-v11',
  'Globe (3D) - Satellite': 'mapbox://styles/mapbox/satellite-v9',
};

const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;
const RADAR_SOURCE_ID = 'owm-radar';
const RADAR_LAYER_ID = 'owm-radar-layer';

function MapboxMap({ location, weather, onMaximize, maximized }) {
  const { latitude, longitude } = location;
  const [style, setStyle] = React.useState(MAP_STYLES['Globe (3D) - Satellite']);
  const [showPopup, setShowPopup] = React.useState(true);
  const [showRadar, setShowRadar] = useState(false);
  const mapRef = useRef();
  // Remove viewport state, let Mapbox handle it

  // Animate zoom: zoom out, then fly in
  useEffect(() => {
    if (mapRef.current) {
      const mbMap = mapRef.current.getMap();
      if (mbMap && latitude && longitude) {
        // Step 1: Zoom out
        mbMap.flyTo({
          center: [longitude, latitude],
          zoom: 2,
          speed: 1.5,
          curve: 1.42,
          essential: true,
        });
        // Step 2: After delay, zoom in
        setTimeout(() => {
          mbMap.flyTo({
            center: [longitude, latitude],
            zoom: 10,
            speed: 1.2,
            curve: 1.42,
            essential: true,
          });
        }, 800);
      }
    }
    setShowPopup(true);
  }, [latitude, longitude]);

  const isGlobe =
    style === MAP_STYLES['Globe (3D) - Streets'] ||
    style === MAP_STYLES['Globe (3D) - Satellite'];
  // Use a key to force re-mount the Map when style or projection changes
  const mapKey = style + (isGlobe ? '-globe' : '-flat');

  useEffect(() => {
    if (!isGlobe || !mapRef.current) return;
    const mbMap = mapRef.current.getMap();
    if (!mbMap || !mbMap.isStyleLoaded()) return;
    if (!mbMap.getSource('mapbox-dem')) {
      mbMap.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14
      });
      mbMap.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
    }
    if (!mbMap.getLayer('sky')) {
      mbMap.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });
    }
  }, [isGlobe, style, mapRef]);

  useEffect(() => {
    const mbMap = mapRef.current && mapRef.current.getMap();
    if (!mbMap || !mbMap.isStyleLoaded()) return;
    // Remove radar if not showing
    if (!showRadar) {
      if (mbMap.getLayer(RADAR_LAYER_ID)) mbMap.removeLayer(RADAR_LAYER_ID);
      if (mbMap.getSource(RADAR_SOURCE_ID)) mbMap.removeSource(RADAR_SOURCE_ID);
      return;
    }
    // Add radar source/layer if showing
    if (!mbMap.getSource(RADAR_SOURCE_ID)) {
      mbMap.addSource(RADAR_SOURCE_ID, {
        type: 'raster',
        tiles: [
          `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`
        ],
        tileSize: 256,
        attribution: 'Radar data © OpenWeatherMap'
      });
    }
    if (!mbMap.getLayer(RADAR_LAYER_ID)) {
      mbMap.addLayer({
        id: RADAR_LAYER_ID,
        type: 'raster',
        source: RADAR_SOURCE_ID,
        paint: { 'raster-opacity': 0.7 }
      });
    }
    // Ensure radar is above labels
    if (mbMap.getLayer('waterway-label')) {
      mbMap.moveLayer(RADAR_LAYER_ID, 'waterway-label');
    }
  }, [showRadar, style, isGlobe]);

  return (
    <>
      <div className="font-bold text-blue-700 text-lg mb-2 text-center">Weather View (Mapbox Map)</div>
      <div className={`relative bg-white rounded shadow overflow-hidden ${maximized ? 'h-full' : ''}`} style={{ height: maximized ? '100%' : 400, minHeight: 400 }}>
        {!maximized && (
          <div className="absolute top-0 left-0 w-full flex justify-center z-30 pointer-events-none">
            <div className="bg-white/90 rounded-b shadow px-2 py-1 flex items-center gap-3 mt-0 max-w-[calc(100%-56px)] ml-[56px] pointer-events-auto" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <label className="text-xs font-semibold text-blue-700 mr-2" htmlFor="mapbox-style-select">Map Type:</label>
              <select
                id="mapbox-style-select"
                value={style}
                onChange={e => setStyle(e.target.value)}
                className="rounded px-2 py-1 text-xs border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white text-blue-700 shadow-sm focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ minWidth: 120 }}
                aria-label="Map style selector"
              >
                {Object.entries(MAP_STYLES).map(([label, value]) => (
                  <option key={label + '-' + value} value={value}>{label}</option>
                ))}
              </select>
              <button
                className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold border shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition
                  ${showRadar ? 'bg-blue-600 text-white border-blue-700' : 'bg-white/90 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                style={{ minWidth: 36, minHeight: 36, zIndex: 40 }}
                onClick={() => setShowRadar(r => !r)}
                title="Toggle radar overlay"
                aria-label={showRadar ? 'Hide radar overlay' : 'Show radar overlay'}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setShowRadar(r => !r); } }}
              >
                {showRadar ? 'Hide Radar Overlay' : 'Show Radar Overlay'}
              </button>
              <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline" aria-label="Mapbox website">Mapbox</a>
              {onMaximize && (
                <button className="ml-2 bg-blue-600 text-white rounded-full p-2 shadow flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-200" onClick={onMaximize} title="Maximize map" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 40 }} aria-label="Maximize map view">
                  {/* Focus visible for maximize button */}
                  <span className="focus-visible:outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2" role="img" aria-label="Maximize">⛶</span>
                </button>
              )}
            </div>
          </div>
        )}
        <div style={{ height: '100%' }}>
          <Map
            key={mapKey}
            ref={mapRef}
            mapLib={mapboxgl}
            initialViewState={{ latitude, longitude, zoom: 2 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={style}
            mapboxAccessToken={MAPBOX_TOKEN}
            projection={isGlobe ? 'globe' : undefined}
            aria-label="Interactive weather map"
          >
            <Marker longitude={longitude} latitude={latitude} anchor="bottom" onClick={() => setShowPopup(true)} aria-label="Selected location marker">
              <div className="text-2xl cursor-pointer" role="img" aria-label="Map marker">📍</div>
        </Marker>
            {showPopup && weather && weather.weather && weather.weather[0] && (
              <Popup longitude={longitude} latitude={latitude} anchor="bottom" onClose={() => setShowPopup(false)} closeOnClick={false} aria-label="Weather popup" role="dialog">
                <div style={{ minWidth: 120 }}>
                  <div className="font-bold text-blue-700">{weather.name}, {weather.sys.country}</div>
                  <div className="text-sm">{weather.weather[0].description}</div>
                  <div className="text-lg font-bold">{weather.main.temp}°C</div>
                </div>
              </Popup>
            )}
            <NavigationControl position="top-left" showCompass={true} aria-label="Map navigation controls" />
          </Map>
        </div>
    </div>
    </>
  );
}

export default MapboxMap; 