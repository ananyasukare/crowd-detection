import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/user/Navbar';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { officeAPI } from '../../services/api';
import { FiFilter, FiList, FiMap, FiSearch, FiClock, FiUsers, FiNavigation, FiMapPin, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Loader from '../../components/user/Loader';
import toast from 'react-hot-toast';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
let ExternalIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

const NearbyOffices = () => {
  const [offices, setOffices] = useState([]);
  const [externalOffices, setExternalOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [viewMode, setViewMode] = useState('map'); 
  const [userLocation, setUserLocation] = useState([28.6139, 77.2090]);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchExternalBanks = async (lat, lon) => {
    setSearching(true);
    console.log(`Discovery started for: ${lat}, ${lon}`);
    try {
      // Primary: Nominatim POI Search with a slightly longer wait if needed
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=bank+near+${lat},${lon}&format=json&addressdetails=1&limit=30`, {
        signal: AbortSignal.timeout(15000) // 15s timeout
      });
      const data = await response.json();
      
      if (data && data.length > 0) {
        const formatted = data.map(e => ({
          _id: `ext-${e.place_id}`,
          name: e.display_name.split(',')[0] || 'Local Bank',
          branch: e.address.suburb || e.address.neighbourhood || 'Branch',
          location: e.address.city || e.address.town || 'Nearby',
          latitude: parseFloat(e.lat),
          longitude: parseFloat(e.lon),
          crowd_level: 'unknown',
          estimated_wait: '??',
          queue_length: '??',
          category: 'Bank',
          isExternal: true
        }));
        setExternalOffices(formatted);
        console.log(`Found ${formatted.length} banks via Nominatim`);
      } else {
        // Fallback: Try Overpass with a simplified query
        const query = `[out:json];node["amenity"="bank"](around:20000,${lat},${lon});out;`;
        const ovResponse = await fetch(`https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(query)}`);
        const ovData = await ovResponse.json();
        const ovFormatted = ovData.elements.map(e => ({
          _id: `ext-${e.id}`,
          name: e.tags.name || 'Local Bank',
          branch: e.tags.branch || 'Branch',
          location: 'Nearby Area',
          latitude: e.lat,
          longitude: e.lon,
          crowd_level: 'unknown',
          estimated_wait: '??',
          queue_length: '??',
          category: 'Bank',
          isExternal: true
        }));
        setExternalOffices(ovFormatted);
        console.log(`Found ${ovFormatted.length} banks via Overpass Fallback`);
      }
    } catch (error) {
      console.error("All discovery methods failed");
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const loc = [latitude, longitude];
          setUserLocation(loc);
          setMapCenter(loc);
          fetchExternalBanks(latitude, longitude);
        },
        () => fetchExternalBanks(userLocation[0], userLocation[1])
      );
    }
    const fetchOffices = async () => {
      try {
        const response = await officeAPI.getAll();
        setOffices(response.data);
      } catch (error) {
        console.error('Error fetching offices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffices();
  }, []);

  const handleSearchLocation = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newLoc = [parseFloat(lat), parseFloat(lon)];
          setMapCenter(newLoc);
          fetchExternalBanks(newLoc[0], newLoc[1]);
          toast.success(`Search result for ${searchQuery}`);
        }
      } catch (error) {}
    }
  };

  const allOffices = [...offices, ...externalOffices];
  const filteredOffices = allOffices.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-inter">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row pt-28 pb-4 px-4 gap-4 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-[400px] flex flex-col space-y-4 overflow-hidden">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900">Nearby Discovery</h2>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">
                {filteredOffices.length} Results
              </span>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search city or bank name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchLocation}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className={`flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar ${viewMode === 'map' ? 'hidden md:block' : 'block'}`}>
            {filteredOffices.length === 0 && !searching && (
              <div className="bg-white rounded-3xl p-10 border-2 border-dashed border-slate-100 text-center">
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Banks Found Nearby</p>
                 <p className="text-slate-300 text-[10px] mt-2">Try searching for a larger city or moving the map.</p>
              </div>
            )}
            
            {filteredOffices.map((office) => (
              <div key={office._id} className={`bg-white rounded-3xl p-6 border transition-all hover:shadow-xl ${office.isExternal ? 'border-slate-100' : 'border-indigo-100 ring-2 ring-indigo-50'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${office.isExternal ? 'bg-slate-50 text-slate-400' : 'bg-indigo-600 text-white'}`}>
                    {office.category === 'ATM' ? '🏧' : '🏦'}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      office.isExternal ? 'text-slate-400 bg-slate-50' : 'text-emerald-500 bg-emerald-50'
                    }`}>
                      {office.isExternal ? 'External Info' : `${office.crowd_level} crowd`}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold mt-1 flex items-center">
                      <FiNavigation className="mr-1" /> {getDistance(mapCenter[0], mapCenter[1], office.latitude, office.longitude)} km
                    </span>
                  </div>
                </div>
                
                <h4 className="font-black text-slate-900 text-lg leading-tight">{office.name}</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-widest">{office.branch}</p>
                
                {!office.isExternal ? (
                  <Link to={`/office/${office._id}`} className="block w-full text-center py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black mt-6 shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                    Book Live Token
                  </Link>
                ) : (
                  <div className="mt-6 flex items-center justify-center py-3 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-dashed border-slate-200">
                    <FiMapPin className="mr-2" /> View Info
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className={`flex-1 relative rounded-[3.5rem] overflow-hidden shadow-sm border border-slate-200 ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
          <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents setMapCenter={setMapCenter} fetchExternalBanks={fetchExternalBanks} searching={searching} />
            {filteredOffices.map((office) => (
              <Marker key={office._id} position={[office.latitude, office.longitude]} icon={office.isExternal ? ExternalIcon : DefaultIcon}>
                <Popup>
                   <div className="p-1">
                      <h4 className="font-black text-indigo-600 leading-tight">{office.name}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">{office.branch}</p>
                      {!office.isExternal && <Link to={`/office/${office._id}`} className="block mt-3 text-center py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black">Book Token</Link>}
                   </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Search this area floating button */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000]">
             <button 
              onClick={() => fetchExternalBanks(mapCenter[0], mapCenter[1])}
              disabled={searching}
              className="px-6 py-3 bg-white text-indigo-600 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl border border-slate-100 flex items-center space-x-2 hover:bg-indigo-50 transition-all"
             >
               {searching ? <FiRefreshCw className="animate-spin text-indigo-600" /> : <FiSearch />}
               <span>{searching ? 'Searching...' : 'Search this area'}</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapEvents = ({ setMapCenter, fetchExternalBanks, searching }) => {
  const map = useMap();
  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      setMapCenter([center.lat, center.lng]);
    },
    locationfound: (e) => {
       map.setView(e.latlng, 14);
       setMapCenter([e.latlng.lat, e.latlng.lng]);
       fetchExternalBanks(e.latlng.lat, e.latlng.lng);
    }
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return null;
};

export default NearbyOffices;
