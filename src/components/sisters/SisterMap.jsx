import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSisters, CITY_PRESETS } from '../../context/SistersContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { 
  MapPin, 
  Navigation, 
  Globe, 
  Search, 
  Crosshair, 
  Check, 
  Star, 
  Heart,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function SisterMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);

  const { navigateTo } = useAuth();

  const { 
    filteredSisters, 
    userLocation,
    detectLiveGPSLocation,
    isLocatingGPS,
    switchCity,
    selectedCityId,
    updateUserPinLocation,
    maxDistanceKm, 
    setMaxDistanceKm,
    setSelectedSisterForBooking, 
    setSelectedSisterForProfile,
    setSelectedSisterForChat,
    activeSisterOnMap,
    setActiveSisterOnMap,
    viewMode
  } = useSisters();

  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 14,
        zoomControl: false,
        scrollWheelZoom: true
      });

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
            <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-pink-400 opacity-75"></span>
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
          <strong style="color: #d81b60; font-size: 13px;">📍 Your Search Center</strong>
          <p style="font-size: 11px; color: #666; margin: 2px 0 0;">Drag pin or click map to change location</p>
        </div>
      `);

      userMarker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        updateUserPinLocation(lat, lng);
      });

      // Click anywhere on map to move user pin
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        updateUserPinLocation(lat, lng);
      });

      userMarkerRef.current = userMarker;
      mapInstanceRef.current = map;
    }

    // Trigger resize check
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map size when view mode changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 150);
    }
  }, [viewMode]);

  // Update user marker position and fly to coordinates
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

      const isSelected = activeSisterOnMap?.id === sister.id;

      const sisterIcon = L.divIcon({
        className: `custom-sister-marker sister-${sister.id}`,
        html: `
          <div class="group relative cursor-pointer transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-115'} transition-all duration-200">
            <div class="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-xl ring-2 ${isSelected ? 'ring-yellow-400 scale-105' : 'ring-[#d81b60]'} bg-white">
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

  }, [filteredSisters, activeSisterOnMap]);

  // Geocoding Search (Find any area/city in India)
  const handleLocationSearch = (e) => {
    e.preventDefault();
    if (!searchLocationQuery.trim()) return;

    setIsSearchingLocation(true);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(searchLocationQuery.trim())}`)
      .then(res => res.json())
      .then(data => {
        setIsSearchingLocation(false);
        if (data && data.length > 0) {
          const first = data[0];
          const lat = parseFloat(first.lat);
          const lng = parseFloat(first.lon);
          updateUserPinLocation(lat, lng);
          setSearchLocationQuery('');
        } else {
          alert("Location not found. Please try another area or city name.");
        }
      })
      .catch(err => {
        console.error("Geocoding failed", err);
        setIsSearchingLocation(false);
      });
  };

  // Fly to sister on map
  const handleFocusSister = (sister) => {
    setActiveSisterOnMap(sister);
    if (mapInstanceRef.current && sister.coordinates) {
      mapInstanceRef.current.flyTo([sister.coordinates.lat, sister.coordinates.lng], 15, { duration: 1 });
    }
  };

  return (
    <div className="space-y-3">
      
      {/* Top Location Toolbar: GPS Status, City Selector, Radius Filters & Pincode/Locality Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-warm-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: GPS Status, City Selector & Radius Pills */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* GPS Status Indicator */}
          <button
            onClick={detectLiveGPSLocation}
            disabled={isLocatingGPS}
            className={`px-3 py-2 rounded-xl border font-bold flex items-center gap-1.5 transition-all ${
              userLocation.isLiveGPS
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-warm-100 hover:bg-white text-gray-800 border-warm-300 hover:border-pink-400'
            }`}
            title="Auto-detect exact GPS coordinates"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocatingGPS ? 'animate-spin text-pink-600' : userLocation.isLiveGPS ? 'text-white' : 'text-[#d81b60]'}`} />
            <span>{isLocatingGPS ? 'Detecting GPS...' : userLocation.isLiveGPS ? '📍 GPS Locked' : 'Locate Me (GPS)'}</span>
          </button>

          {/* City Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-warm-50 px-2.5 py-1.5 rounded-xl border border-warm-200">
            <Globe className="w-3.5 h-3.5 text-[#d81b60]" />
            <span className="text-gray-500 font-medium">City:</span>
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

          {/* Radius Filter Pills */}
          <div className="flex items-center gap-1 bg-warm-100 p-1 rounded-xl">
            {[3, 5, 10, 25].map(radius => (
              <button
                key={radius}
                onClick={() => setMaxDistanceKm(radius)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  maxDistanceKm === radius
                    ? 'bg-[#d81b60] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {radius}km
              </button>
            ))}
          </div>
        </div>

        {/* Right: Pincode / Locality Search Box with Jump button */}
        <form onSubmit={handleLocationSearch} className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            placeholder="Search locality / pincode (e.g. Indiranagar, Nagpur...)"
            value={searchLocationQuery}
            onChange={(e) => setSearchLocationQuery(e.target.value)}
            className="w-full pl-8 pr-16 py-2 text-xs bg-warm-50 border border-warm-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/30"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            disabled={isSearchingLocation}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#d81b60] text-white font-bold rounded-lg text-[10px] hover:bg-[#c2185b] transition-colors"
          >
            {isSearchingLocation ? '...' : 'Jump'}
          </button>
        </form>

      </div>

      {/* Main Map Box */}
      <div className="relative w-full h-[480px] sm:h-[530px] rounded-3xl overflow-hidden shadow-card border border-warm-200 bg-warm-100">
        
        {/* Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Location Info Pill */}
        <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-warm-200 flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="font-bold text-gray-800">
              {userLocation.address || 'Active Zone'}
            </span>
            <span className="text-gray-500 block text-[10px]">
              Showing {filteredSisters.length} sisters within {maxDistanceKm}km (Click map to move search)
            </span>
          </div>
        </div>

        {/* Active Sister Floating Preview Card with Visit Shop & Hire Her */}
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
                      ★ {Number(activeSisterOnMap.rating).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{activeSisterOnMap.specialty}</p>
                  <p className="text-[11px] text-pink-700 font-bold mt-0.5">
                    📍 {activeSisterOnMap.distance || 'Near you'}
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
                {/* Visit Shop Button */}
                <button
                  onClick={() => navigateTo('shop-detail', activeSisterOnMap.id)}
                  className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>Visit Shop</span>
                  <ArrowRight className="w-3 h-3 text-[#d81b60]" />
                </button>

                {/* Hire Her Button */}
                <button
                  onClick={() => setSelectedSisterForBooking(activeSisterOnMap)}
                  className="px-4 py-1.5 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
                >
                  Hire Her
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Quick Nearby Sisters Horizontal Scroller */}
      {filteredSisters.length > 0 && (
        <div className="bg-white p-3 rounded-2xl border border-warm-200 shadow-sm">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
              Sisters Near This Pin ({filteredSisters.length})
            </span>
            <span className="text-[11px] text-pink-700 font-semibold">Click to focus on map</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {filteredSisters.map(sister => {
              const isSelected = activeSisterOnMap?.id === sister.id;
              return (
                <div
                  key={sister.id}
                  onClick={() => handleFocusSister(sister)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer shrink-0 transition-all ${
                    isSelected
                      ? 'bg-pink-50 border-[#d81b60] shadow-sm ring-1 ring-[#d81b60]'
                      : 'bg-warm-50 border-warm-200 hover:border-pink-300'
                  }`}
                >
                  <img src={sister.avatar} alt={sister.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-pink-400" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900 truncate max-w-[110px]">{sister.name}</p>
                    <p className="text-[10px] text-pink-700 font-semibold">{sister.distance || '1.0 km'}</p>
                  </div>
                  <span className="text-xs font-extrabold text-gray-800 ml-1">{formatCurrency(sister.rate)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
