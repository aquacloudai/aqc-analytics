import { Grid, Text, Group, Paper, Stack, Flex } from '@mantine/core';
import { useFarmers } from '../hooks/useFarmers';
import { useFarmAndSiteStats } from '../hooks/useFarmAndSiteStats';
import { useLossByRegion } from '../hooks/useLossByRegion';

import { FarmersInAquaCloudTable } from '../components/tables/FarmersInAquaCloudTable';
import { BiomassComparisonChart } from '../components/charts/BiomassComparisonChart';
import { LossByRegionOverview } from '../components/LossByRegionContainer';

export function Dashboard() {
  const { data: farmers } = useFarmers();
  const { data: stats } = useFarmAndSiteStats();
  const { data: lossByRegion } = useLossByRegion();

  return (
    <Stack gap="lg">
      <Paper p="md" radius="md" withBorder>
        <Flex gap="xl" align="center" wrap="wrap">
          {[
            { label: 'Aktive oppdrettere', value: stats?.active_farmers },
            { label: 'Sjølokaliteter', value: stats?.offshore_sites },
            { label: 'Nylig aktiv lokalitet', value: stats?.recently_active_sites },
          ].map(({ label, value }) => (
            <Group key={label} gap="xs">
              <Text size="sm" fw={500}>{label}</Text>
              <Text size="lg" fw={700}>{value ?? '–'}</Text>
            </Group>
          ))}
        </Flex>
      </Paper>

      <LossByRegionOverview data={lossByRegion} />

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <BiomassComparisonChart />
        </Grid.Col>
      </Grid>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <FarmersInAquaCloudTable farmers={farmers} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
