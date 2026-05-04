import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAssets } from '../hooks/useContexts';
import { Button, Card, LoadingSpinner, Input } from '../components/UI';
import { getQueueMarkerColor, formatWaitTime } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapMarker = ({ asset, onClick }) => {
  const color = getQueueMarkerColor(asset.queue_length);
  const icon = new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; cursor: pointer;">${asset.queue_length}</div>`,
    iconSize: [30, 30],
  });

  return (
    <Marker position={[asset.latitude, asset.longitude]} icon={icon} eventHandlers={{ click: onClick }}>
      <Popup>
        <div className="p-2">
          <h3 className="font-bold text-gray-900">{asset.name}</h3>
          <p className="text-sm text-gray-600">{asset.location}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p>Queue: {asset.queue_length} people</p>
            <p>Wait: {formatWaitTime(asset.estimated_wait)}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const MapContent = ({ assets, onAssetClick, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], 13);
    }
  }, [userLocation, map]);

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {userLocation && (
        <Marker position={[userLocation.latitude, userLocation.longitude]}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
      {assets.map((asset) => (
        <MapMarker key={asset.id} asset={asset} onClick={() => onAssetClick(asset.id)} />
      ))}
    </>
  );
};

export default function MapPage() {
  const navigate = useNavigate();
  const { nearbyAssets, fetchNearbyAssets, loading } = useAssets();
  const [userLocation, setUserLocation] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        fetchNearbyAssets(latitude, longitude, 10);
      });
    }
  }, []);

  const filteredAssets = nearbyAssets.filter((asset) => {
    if (filter === 'low') return asset.queue_length < 10;
    if (filter === 'medium') return asset.queue_length >= 10 && asset.queue_length < 30;
    if (filter === 'high') return asset.queue_length >= 30;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asset Map</h1>
            <p className="text-gray-600 mt-2">Locate nearby government assets and view queue status</p>
          </div>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-6">
          <Card className="lg:col-span-4">
            <div className="flex gap-4">
              <Button 
                onClick={() => setFilter('all')}
                variant={filter === 'all' ? 'primary' : 'secondary'}
                size="sm"
              >
                All
              </Button>
              <Button 
                onClick={() => setFilter('low')}
                variant={filter === 'low' ? 'primary' : 'secondary'}
                size="sm"
              >
                🟢 Low Queue
              </Button>
              <Button 
                onClick={() => setFilter('medium')}
                variant={filter === 'medium' ? 'primary' : 'secondary'}
                size="sm"
              >
                🟡 Medium Queue
              </Button>
              <Button 
                onClick={() => setFilter('high')}
                variant={filter === 'high' ? 'primary' : 'secondary'}
                size="sm"
              >
                🔴 High Queue
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Map */}
          <Card className="lg:col-span-3 p-0 h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner text="Loading map..." />
              </div>
            ) : (
              <MapContainer center={[28.6139, 77.2090]} zoom={13} className="w-full h-full">
                <MapContent 
                  assets={filteredAssets} 
                  onAssetClick={(id) => navigate(`/asset/${id}`)}
                  userLocation={userLocation}
                />
              </MapContainer>
            )}
          </Card>

          {/* Assets List */}
          <Card className="h-[500px] overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-4">Assets ({filteredAssets.length})</h3>
            <div className="space-y-3">
              {filteredAssets.map((asset) => (
                <div 
                  key={asset.id}
                  className="p-3 border border-violet-900 rounded-lg cursor-pointer hover:bg-violet-900 hover:bg-opacity-20 transition bg-gray-800"
                  onClick={() => navigate(`/asset/${asset.id}`)}
                >
                  <p className="font-semibold text-sm text-gray-900">{asset.name}</p>
                  <p className="text-xs text-gray-600 truncate">{asset.location}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span>Queue: {asset.queue_length}</span>
                    <span>Wait: {formatWaitTime(asset.estimated_wait)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
