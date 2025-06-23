import { Title, Paper } from '@mantine/core';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export function FarmMap() {
  // Norwegian salmon farming coordinates (example)
  const farms = [
    { id: 1, name: 'Northern Fjord Farm', lat: 69.6492, lng: 18.9553, biomass: 1200, pens: 12 },
    { id: 2, name: 'Southern Bay Farm', lat: 58.9690, lng: 5.7331, biomass: 800, pens: 8 },
    { id: 3, name: 'Western Coast Farm', lat: 62.4722, lng: 6.1549, biomass: 1500, pens: 15 },
  ];

  const getColorByBiomass = (biomass: number) => {
    if (biomass > 1200) return '#2e7d32';
    if (biomass > 900) return '#1976d2';
    return '#ed6c02';
  };

  return (
    <div>
      <Title order={1} mb="lg">Farm Locations</Title>
      
      <Paper radius="md" withBorder style={{ height: 'calc(100vh - 200px)' }}>
        <MapContainer 
          center={[65.0, 13.0]} 
          zoom={5} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {farms.map((farm) => (
            <CircleMarker
              key={farm.id}
              center={[farm.lat, farm.lng]}
              radius={Math.sqrt(farm.biomass) / 4}
              pathOptions={{
                fillColor: getColorByBiomass(farm.biomass),
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
              }}
            >
              <Popup>
                <div>
                  <strong>{farm.name}</strong>
                  <br />
                  Biomass: {farm.biomass} tons
                  <br />
                  Pens: {farm.pens}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </Paper>
    </div>
  );
}