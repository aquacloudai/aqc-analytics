// pages/SiteDetail.tsx
import { useParams } from 'react-router-dom';
import { Title, Text, Paper, Loader } from '@mantine/core';
import { useSite } from '../hooks/common/useSite';

export function Site() {
  const { site_id } = useParams<{ site_id: string }>();
  const { data: site, loading, error } = useSite(site_id!); // site_id is assumed to exist

  if (loading) return <Loader />;
  if (error) return <Text color="red">{error}</Text>;
  if (!site) return <Text color="red">Fant ikke lokalitet med ID: {site_id}</Text>;

  return (
    <Paper p="md" radius="md" shadow="sm">
      <Title order={2}>{site.site_name}</Title>
      <Text mt="sm">Plassering: {site.placement}</Text>
      <Text>Område: {site.production_area_name}</Text>
      <Text>Marine type: {site.marine_type_name || 'Ukjent'}</Text>
      <Text>Koordinater: {site.latitude}, {site.longitude}</Text>
      {site.is_in_aquacloud && (
        <Text mt="md" c="blue">Denne lokaliteten er i AquaCloud</Text>
      )}
    </Paper>
  );
}
