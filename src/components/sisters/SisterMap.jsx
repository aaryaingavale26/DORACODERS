import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSisters, CITY_PRESETS } from '../../context/SistersContext';
import { formatCurrency } from '../../lib/utils';
import { MapPin, Navigation, Compass, Globe, Sparkles, Check } from 'lucide-react';

export default function SisterMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);

  const { 
    filteredSisters, 
    userLocation,
    detectLiveGPSLocation,
    isLocatingGPS,
    switchCity,
    selectedCityId,
    updateUserPinLocation,
    maxDistanceKm, 
    setSelectedSisterForBooking, 
    setSelectedSisterForProfile,
    activeSisterOnMap,
    setActiveSisterOnMap
  } = useSisters();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 14,
        zoomControl: false, // customized below
        scrollWheelZoom: true
      });

      // Add zoom control on bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Voyager tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      // Draggable User Location Marker
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-move">
            <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-pink-400 opacity-75"></span>
            <div class="relative inline-flex rounded-full h-8 w-8 bg-[#d81b60] border-2 border-white items-center justify-center text-white shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { 
        icon: userIcon,
        draggable: true
      }).addTo(map);

      userMarker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; text-align: center;">
          <strong style="color: #d81b60; font-size: 13px;">📍 Your Location (${userLocation.address || 'Selected'})</strong>
          <p style="font-size: 11px; color: #666; margin: 2px 0 0;">Drag this pin to search any neighborhood</p>
        </div>
      `);

      userMarker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        updateUserPinLocation(lat, lng);
      });

      userMarkerRef.current = userMarker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update user marker position and fly to new coordinates when userLocation changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userMarkerRef.current) return;

    userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    map.flyTo([userLocation.lat, userLocation.lng], maxDistanceKm <= 3 ? 14 : 13, { duration: 1.2 });

  }, [userLocation]);

  // Update radius circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (circleRef.current) {
      circleRef.current.remove();
    }

    const circle = L.circle([userLocation.lat, userLocation.lng], {
      radius: maxDistanceKm * 1000,
      color: '#d81b60',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#d81b60',
      fillOpacity: 0.08
    }).addTo(map);

    circleRef.current = circle;

  }, [userLocation, maxDistanceKm]);

  // Update sister markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredSisters.forEach(sister => {
      if (!sister.coordinates) return;

      const sisterIcon = L.divIcon({
        className: `custom-sister-marker sister-${sister.id}`,
        html: `
          <div class="group relative cursor-pointer transform hover:scale-110 transition-transform duration-200">
            <div class="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-xl ring-2 ring-[#d81b60] bg-white">
              <img src="${sister.avatar}" alt="${sister.name}" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#d81b60] border border-white flex items-center justify-center text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#831843] text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full shadow whitespace-nowrap">
              ★ ${Number(sister.rating).toFixed(1)}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([sister.coordinates.lat, sister.coordinates.lng], { icon: sisterIcon })
        .addTo(map);

      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 190px; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <img src="${sister.avatar}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1.5px solid #d81b60;" />
            <div>
              <strong style="font-size: 13px; color: #231b15; display: block; line-height: 1.2;">${sister.name}</strong>
              <span style="font-size: 11px; color: #777;">${sister.specialty}</span>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 6px; margin-top: 4px;">
            <strong style="color: #231b15; font-size: 13px;">${formatCurrency(sister.rate)}<span style="font-size: 10px; font-weight: normal; color: #888;">${sister.rateUnit || '/visit'}</span></strong>
            <span style="font-size: 11px; color: #d81b60; font-weight: bold;">${sister.distance || 'Near you'}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setActiveSisterOnMap(sister);
      });

      markersRef.current.push(marker);
    });

  }, [filteredSisters]);

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden shadow-card border border-warm-200 bg-warm-100">
      
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Control Toolbar (Real-Time GPS & City Switcher) */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 flex flex-wrap items-center gap-2">
        
        {/* Real-Time GPS Detection Button */}
        <button
          onClick={detectLiveGPSLocation}
          disabled={isLocatingGPS}
          className={`px-3.5 py-2 rounded-2xl shadow-md border text-xs font-bold flex items-center gap-1.5 transition-all ${
            userLocation.isLiveGPS
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30'
              : 'bg-white/95 hover:bg-white text-gray-800 border-warm-300 hover:border-pink-400'
          }`}
          title="Detect live GPS coordinates from your device"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocatingGPS ? 'animate-spin text-pink-600' : userLocation.isLiveGPS ? 'text-white' : 'text-[#d81b60]'}`} />
          <span>{isLocatingGPS ? 'Detecting GPS...' : userLocation.isLiveGPS ? '📍 Live GPS Active' : 'Use My Live GPS'}</span>
        </button>

        {/* City Selector Preset Dropdown */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-warm-300 flex items-center gap-1.5 text-xs">
          <Globe className="w-3.5 h-3.5 text-[#d81b60]" />
          <span className="font-semibold text-gray-600 hidden md:inline">City:</span>
          <select
            value={selectedCityId}
            onChange={(e) => switchCity(e.target.value)}
            className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer"
          >
            {CITY_PRESETS.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Count Badge */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-warm-300 flex items-center gap-1.5 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-gray-800">
            {filteredSisters.length} Sisters within {maxDistanceKm}km
          </span>
        </div>

      </div>

      {/* Active Sister Selected Floating Card */}
      {activeSisterOnMap && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-10 bg-white rounded-2xl p-4 shadow-2xl border border-pink-200 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={activeSisterOnMap.avatar}
                alt={activeSisterOnMap.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-pink"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-gray-900">{activeSisterOnMap.name}</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    Available
                  </span>
                </div>
                <p className="text-xs text-gray-500">{activeSisterOnMap.specialty}</p>
                <p className="text-[11px] text-pink-700 font-bold mt-0.5">
                  📍 {activeSisterOnMap.distance || '1.2 km away'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveSisterOnMap(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-warm-100 flex items-center justify-between gap-2">
            <div>
              <span className="font-extrabold text-gray-900 text-sm">
                {formatCurrency(activeSisterOnMap.rate)}
              </span>
              <span className="text-[11px] text-gray-500">{activeSisterOnMap.rateUnit || '/visit'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedSisterForProfile(activeSisterOnMap)}
                className="px-3 py-1.5 border border-warm-300 hover:bg-pink-50 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Profile
              </button>
              <button
                onClick={() => setSelectedSisterForBooking(activeSisterOnMap)}
                className="px-4 py-1.5 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Hire Her
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
