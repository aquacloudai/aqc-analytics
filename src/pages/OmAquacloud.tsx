import { Grid, Text, Paper, Stack, Title, Card, SimpleGrid, Center } from '@mantine/core';
import { useFarmers } from '../hooks/useFarmers';
import { useFarmAndSiteStats } from '../hooks/useFarmAndSiteStats';
import { FarmersInAquaCloudTable } from '../components/tables/FarmersInAquaCloudTable';
import { BiomassComparisonChart } from '../components/charts/BiomassComparisonChart';

export function OmaquaCloud() {
  const { data: farmers } = useFarmers();
  const { data: stats } = useFarmAndSiteStats();

  const statsList = [
    { label: 'Aktive oppdrettere', value: stats?.active_farmers },
    { label: 'Sjølokaliteter', value: stats?.offshore_sites },
    { label: 'Settefisk', value: stats?.onshore_sites },
    { label: 'Aquacloud', value: stats?.signed_farmers },
    { label: 'Nylig aktiv lokalitet', value: stats?.recently_active_sites },
  ];


  return (
    <Stack gap="lg">
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 5 }}
        spacing="lg"
      >
        {statsList.map(({ label, value }) => (
          <Card key={label} shadow="sm" radius="md" withBorder>
            <Stack align="center" gap={4}>
              <Text size="sm" c="dimmed">{label}</Text>
              <Text size="xl" fw={700}>{value ?? '–'}</Text>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Paper withBorder p="md" radius="md">
        <BiomassComparisonChart />
      </Paper>

      <Paper withBorder p="md" radius="md">
        
       <FarmersInAquaCloudTable farmers={farmers} />

      </Paper>
    </Stack>
  );
}
