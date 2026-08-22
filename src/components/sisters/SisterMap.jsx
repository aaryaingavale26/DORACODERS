import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSisters } from '../../context/SistersContext';
import { DEFAULT_USER_LOCATION } from '../../data/initialSisters';
import { formatCurrency } from '../../lib/utils';
import { MapPin, ShieldCheck, Navigation } from 'lucide-react';

export default function SisterMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);

  const { 
    filteredSisters, 
    maxDistanceKm, 
    setSelectedSisterForBooking, 
    setSelectedSisterForProfile,
    setSelectedSisterForChat,
    activeSisterOnMap,
    setActiveSisterOnMap
  } = useSisters();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [DEFAULT_USER_LOCATION.lat, DEFAULT_USER_LOCATION.lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // CartoDB Voyager tile layer for warm aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      // User location marker
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-pink-400 opacity-75"></span>
            <div class="relative inline-flex rounded-full h-7 w-7 bg-[#d81b60] border-2 border-white items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const userMarker = L.marker([DEFAULT_USER_LOCATION.lat, DEFAULT_USER_LOCATION.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; text-align: center;">
            <strong style="color: #d81b60; font-size: 13px;">📍 Your Location</strong>
            <p style="font-size: 11px; color: #666; margin: 2px 0 0;">Searching for Skilled Sisters within ${maxDistanceKm}km</p>
          </div>
        `);

      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup if component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update radius circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (circleRef.current) {
      circleRef.current.remove();
    }

    // Draw radius zone in pink
    const circle = L.circle([DEFAULT_USER_LOCATION.lat, DEFAULT_USER_LOCATION.lng], {
      radius: maxDistanceKm * 1000,
      color: '#d81b60',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#d81b60',
      fillOpacity: 0.08
    }).addTo(map);

    circleRef.current = circle;

    // Adjust zoom to fit circle
    const zoomLevel = maxDistanceKm <= 3 ? 14 : maxDistanceKm <= 5 ? 13 : maxDistanceKm <= 10 ? 12 : 11;
    map.setView([DEFAULT_USER_LOCATION.lat, DEFAULT_USER_LOCATION.lng], zoomLevel);

  }, [maxDistanceKm]);

  // Update sister markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add new markers for filtered sisters
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

      // Popup Content
      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 180px; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <img src="${sister.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #d81b60;" />
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

  // Recenter button
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([DEFAULT_USER_LOCATION.lat, DEFAULT_USER_LOCATION.lng], 14, { duration: 1 });
    }
  };

  return (
    <div className="relative w-full h-[450px] sm:h-[500px] rounded-3xl overflow-hidden shadow-card border border-warm-200 bg-warm-100">
      
      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Info Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-warm-200 flex items-center gap-2 text-xs">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-bold text-gray-800">Live 3km Neighborhood Radar</span>
        <span className="bg-pink-100 text-pink-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {filteredSisters.length} Sisters Nearby
        </span>
      </div>

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        className="absolute top-3 right-3 z-10 bg-white/95 hover:bg-white text-gray-700 hover:text-brand-pink p-2.5 rounded-2xl shadow-md border border-warm-200 transition-all flex items-center gap-1.5 text-xs font-semibold"
        title="Recenter to my location"
      >
        <Navigation className="w-4 h-4 text-brand-pink" />
        <span className="hidden sm:inline">My Zone</span>
      </button>

      {/* Active Sister Selected Card (Floating on Map) */}
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
                <h4 className="font-bold text-sm text-gray-900">{activeSisterOnMap.name}</h4>
                <p className="text-xs text-gray-500">{activeSisterOnMap.specialty}</p>
                <p className="text-[11px] text-pink-700 font-semibold">{activeSisterOnMap.distance || '1.2 km away'}</p>
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
