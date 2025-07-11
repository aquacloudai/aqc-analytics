import { useState } from 'react';
import {
  Grid,
  Title,
  Select,
  Paper,
  TextInput,
  Text,
} from '@mantine/core';
import { SiteCard } from '../components/SiteCard';
import { useSites } from '../hooks/common/useSites';
import type { Site } from '../types/site';

export function Sites() {
  const { data: sites, loading, error } = useSites();
  const [search, setSearch] = useState('');
  const [filterPlacement, setFilterPlacement] = useState<string | null>(null);

  // Filter AquaCloud-only and apply search/placement filters
  const filtered = sites.filter((site) => {
    return (
      site.is_in_aquacloud &&
      site.site_name.toLowerCase().includes(search.toLowerCase()) &&
      (!filterPlacement || site.placement === filterPlacement)
    );
  });

  // Group by production area
  const groupedByProductionArea = filtered.reduce((groups, site) => {
    const area = site.production_area_name || 'Landbasert';
    if (!groups[area]) {
      groups[area] = [];
    }
    groups[area].push(site);
    return groups;
  }, {} as Record<string, Site[]>);

  // Sort area names alphabetically
  const sortedAreaNames = Object.keys(groupedByProductionArea).sort((a, b) =>
    a.localeCompare(b)
  );

  if (loading) return <Text>Henter lokaliteter...</Text>;
  if (error) return <Text color="red">Feil ved henting av lokaliteter.</Text>;
  if (filtered.length === 0) return <Text>Ingen lokaliteter funnet.</Text>;

  return (
    <div>
      <Title order={2} mb="md">Lokaliteter</Title>

      <Paper shadow="sm" p="md" mb="lg">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Søk på navn"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="F.eks. Nordvika"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Filtrer etter plassering"
              value={filterPlacement}
              onChange={setFilterPlacement}
              data={[
                { value: 'onshore', label: 'Landbasert' },
                { value: 'offshore', label: 'Havbasert' },
              ]}
              clearable
            />
          </Grid.Col>
        </Grid>
      </Paper>

      <Title order={3} mb="sm">
        Viser {filtered.length} lokalitet(er) i AquaCloud
      </Title>

      {sortedAreaNames.map((area) => (
        <div key={area} style={{ marginBottom: '2rem' }}>
          <Title order={4} mb="sm">{area}</Title>
          <Grid>
            {groupedByProductionArea[area].map((site) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={site.site_id}>
                <SiteCard site={site} />
              </Grid.Col>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
}
