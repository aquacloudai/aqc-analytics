import {
  Title,
  Paper,
  Stack,
  Group,
  Badge,
  Select,
  SegmentedControl,
} from '@mantine/core';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import api from '../api/auth/apiClient';
import { isKeycloakReady } from '../config/keycloak';
import type { Site } from '../types/site';
import { GeoJSON } from 'react-leaflet';
import { Switch } from '@mantine/core';


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const marineTypeColors: Record<string, string> = {
  'Bølgeeksponert kyst': '#2e7d32',
  'Moderat eksponert fjord/kyst': '#1976d2',
  'Skjermet fjord': '#f59f00',
  'Eksponert åpen sjø': '#d6336c',
  'Beskyttet fjord/kyst': '#6c757d',
  'Beskyttet ferskvannspåvirket fjord/kyst': '#adb5bd',
};

const getColorByMarineType = (typeName?: string | null) =>
  typeName && marineTypeColors[typeName] ? marineTypeColors[typeName] : '#adb5bd';

export function FarmMap() {
  const [sites, setSites] = useState<Site[]>([]);
  const [filteredSites, setFilteredSites] = useState<Site[]>([]);
  const [marineLayer, setMarineLayer] = useState<any | null>(null);
  const [onlyInAquaCloud, setOnlyInAquaCloud] = useState(false);



  const [selectedPlacement, setSelectedPlacement] = useState<string>('');
  const [selectedProductionArea, setSelectedProductionArea] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/marine_typology_reduced.geojson')
      .then((res) => res.json())
      .then(setMarineLayer)
      .catch((err) => console.error('[FarmMap] Failed to load marine layer:', err));
  }, []);


  useEffect(() => {
    if (!isKeycloakReady()) return;
    api
      .get<{ data: Site[] }>('/v3/common/site', {
        params: { limit: 2000 },
      })
      .then((res) => {
        const allSites = res.data?.data || [];
        setSites(allSites);
        setFilteredSites(allSites);
      })
      .catch((err) => console.error('[FarmMap] Failed to fetch sites:', err));
  }, []);

  useEffect(() => {
    let result = sites;

    if (selectedPlacement && selectedPlacement !== '') {
      result = result.filter((s) => s.placement === selectedPlacement);
    }

    if (selectedProductionArea) {
      result = result.filter((s) => s.production_area_name === selectedProductionArea);
    }

    if (onlyInAquaCloud) {
      result = result.filter((s) => s.is_in_aquacloud);
    }

    setFilteredSites(result);
  }, [selectedPlacement, selectedProductionArea, onlyInAquaCloud, sites]);


  // Unique production areas for dropdown
  const productionAreas = Array.from(
    new Set(sites.map((s) => s.production_area_name).filter(Boolean))
  );

  return (
    <div>
      <Title order={3} mb="md">
        Farm Locations
      </Title>

      <Paper radius="md" withBorder style={{ height: 'calc(100vh - 320px)' }}>
        <MapContainer center={[65.0, 13.0]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {marineLayer && (
            <GeoJSON
              data={marineLayer}
              style={(feature) => ({
                color: '#000',
                weight: 1,
                fillColor: getColorByMarineType(feature?.properties?.marine_type_name),
                fillOpacity: 0.5,
              })}
              onEachFeature={(feature, layer) => {
                const name = feature?.properties?.name ?? 'Marine Area';
                const type = feature?.properties?.marine_type_name ?? 'Unknown';
                layer.bindPopup(`<strong>${name}</strong><br/>${type}`);
              }}
            />
          )}

          {filteredSites.map((site) => (
            <CircleMarker
              key={site.site_id}
              center={[site.latitude, site.longitude]}
              radius={5}
              pathOptions={{
                fillColor: getColorByMarineType(site.marine_type_name),
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.9,
              }}
            >



              <Popup>
                <Stack gap="xs">
                  <Title order={6}>{site.site_name}</Title>
                  <div>
                    <strong>Plassering:</strong> {site.placement}
                  </div>
                  <div>
                    <strong>Sjø:</strong> {site.marine_type_region_name || 'Ikke registrert'}
                  </div>
                  {site.marine_type_name && (
                    <div>
                      <strong>Marine Type:</strong> {site.marine_type_name}
                    </div>
                  )}
                  {site.production_area_name && (
                    <div>
                      <strong>PO:</strong> {site.production_area_name}
                    </div>
                  )}
                  <div>
                    <strong>AquaCloud:</strong>{' '}
                    <Badge color={site.is_in_aquacloud ? 'green' : 'gray'}>
                      {site.is_in_aquacloud ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </Stack>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </Paper>

      {/* Filters */}
      <Group mt="md" gap="md" wrap="wrap">
        <Select
          label="Produksjonsområde"
          placeholder="Velg område"
          clearable
          data={productionAreas.map((area) => ({ value: area, label: area }))}
          value={selectedProductionArea}
          onChange={setSelectedProductionArea}
        />
        <Switch
          label="Vis kun AquaCloud"
          checked={onlyInAquaCloud}
          onChange={(event) => setOnlyInAquaCloud(event.currentTarget.checked)}
        />



        <SegmentedControl
          value={selectedPlacement}
          onChange={setSelectedPlacement}
          data={[
            { label: 'Alle', value: '' },
            { label: 'Offshore', value: 'offshore' },
            { label: 'Onshore', value: 'onshore' },
          ]}
          color="blue"
        />
      </Group>

      {/* Legend */}
      <Group mt="md" gap="xs" wrap="wrap">
        {Object.entries(marineTypeColors).map(([label, color]) => (
          <Badge key={label} color={color} variant="light">
            {label}
          </Badge>
        ))}
      </Group>
    </div>
  );
}