import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, RefreshCw, BarChart2, Radio, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// This sub-component automatically pans the camera when you click a new target
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 6, { duration: 1.5 });
  }, [center, map]);
  return null;
}

function App() {
  const [geoData, setGeoData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/geodata');
      setGeoData(response.data);
      if (response.data.length > 0 && !selectedRegion) {
        setSelectedRegion(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching geospatial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', padding: '24px' }}>
      {/* Header Banner */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={32} color="#38bdf8" />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>ORBITAL WATCHDOG</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Multi-Modal AI Geospatial Reconnaissance Platform</p>
          </div>
        </div>
        <button 
          onClick={fetchTelemetry}
          disabled={loading}
          style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#f8fafc', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Ingesting...' : 'Sync Telemetry'}
        </button>
      </header>

      {/* Main Grid: 1/3 for Selector, 2/3 for Map & Data */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Left Column: Region Selector Panel */}
        <section style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', height: 'fit-content' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={20} color="#38bdf8" /> Active Targets
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {geoData.map((region) => (
              <div 
                key={region.region_id}
                onClick={() => setSelectedRegion(region)}
                style={{ 
                  padding: '16px', 
                  borderRadius: '6px', 
                  backgroundColor: selectedRegion?.region_id === region.region_id ? '#334155' : '#0f172a',
                  border: selectedRegion?.region_id === region.region_id ? '1px solid #38bdf8' : '1px solid #1e293b',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>{region.region_name}</span>
                </div>
                <div style={{ fontSize: '12px', padding: '4px 0', color: '#ef4444', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {region.analysis_type.replace('_', ' ')}
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                  [{region.coordinates.lat}, {region.coordinates.lng}]
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Map & AI Analysis Viewport */}
        {selectedRegion && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Interactive Leaflet Map */}
            <div style={{ height: '400px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', left: '50px', zIndex: 1000, backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '6px 12px', borderRadius: '4px', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapIcon size={14} /> LIVE SATELLITE FEED
              </div>
              <MapContainer 
                center={[selectedRegion.coordinates.lat, selectedRegion.coordinates.lng]} 
                zoom={6} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri"
                />
                <CircleMarker 
                  center={[selectedRegion.coordinates.lat, selectedRegion.coordinates.lng]} 
                  radius={40}
                  pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.4, weight: 2 }}
                >
                  <Popup>
                    <strong style={{ color: '#0f172a' }}>{selectedRegion.region_name}</strong><br/>
                    Anomaly Detected.
                  </Popup>
                </CircleMarker>
                <MapController center={[selectedRegion.coordinates.lat, selectedRegion.coordinates.lng]} />
              </MapContainer>
            </div>

            {/* AI Telemetry Panel */}
            <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={20} color="#38bdf8" /> Multi-Modal Target Telemetry
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>2016 Baseline Index</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{selectedRegion.telemetry.baseline_2016_index}%</div>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>2026 Target Index</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{selectedRegion.telemetry.current_2026_index}%</div>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>AI Confidence Score</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#eab308' }}>{(selectedRegion.telemetry.ai_confidence_score * 100).toFixed(0)}%</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#7f1d1d', border: '1px solid #b91c1c', padding: '16px', borderRadius: '6px', display: 'flex', gap: '12px' }}>
                <AlertTriangle color="#f87171" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#fca5a5' }}>AI Neural Analysis Report</h4>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#fecdd3' }}>{selectedRegion.ai_insight}</p>
                </div>
              </div>
            </div>

          </section>
        )}
      </div>
    </div>
  );
}

export default App;