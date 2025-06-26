import {
  Grid,
  Text,
  Group,
  Paper,
  Stack,
  Flex
} from '@mantine/core';
import api from '../services/api';
import { useState, useEffect } from 'react';
import type { Farmer } from '../types/farmer';
import { isKeycloakReady } from '../config/keycloak';
import type { FarmAndSiteStats } from '../types/farm_and_site_stats';
import type { AquacloudFdirBiomassPerMonth } from '../types/aquacloud_fdir_biomass_per_month';

import { FarmersInAquaCloudTable } from '../components/tables/FarmersInAquaCloudTable';
import { BiomassComparisonChart } from '../components/charts/BiomassComparisonChart';
import { LossByRegionOverview } from '../components/LossByRegionContainer';
import type { LossByRegionRecord } from '../types/loss_by_region';


export function Dashboard() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [farmAndSiteStats, setFarmAndSiteStats] = useState<FarmAndSiteStats | null>(null);
  const [aquacloudFdirBiomassPerMonth, setAquacloudFdirBiomassPerMonth] = useState<AquacloudFdirBiomassPerMonth[]>([]);
  const [lossByRegion, setLossByRegion] = useState<LossByRegionRecord[]>([]);

  useEffect(() => {
    if (!isKeycloakReady()) return; // wait until auth is ready

    const fetchFarmers = async () => {
      try {
        const response = await api.get<{ data: Farmer[] }>('/v3/common/farmers-in-aquacloud');
        setFarmers(response.data?.data || []);
      } catch (error) {
        console.error('[Dashboard] Failed to fetch farmers:', error);
      }
    };

    fetchFarmers();
  }, [isKeycloakReady()]);

  useEffect(() => {
    if (!isKeycloakReady()) return; // wait until auth is ready

    const fetchFarmAndSiteStats = async () => {
      try {
        const response = await api.get<{ data: FarmAndSiteStats }>('/v3/common/farm-and-site-stats');
        setFarmAndSiteStats(response.data?.data || null);
      } catch (error) {
        console.error('[Dashboard] Failed to fetch farm and site stats:', error);
      }
    };
    fetchFarmAndSiteStats();
  }, [isKeycloakReady()]);


  useEffect(() => {
    if (!isKeycloakReady()) return; // wait until auth is ready

    const fetchAquacloudFdirBiomassPerMonth = async () => {
      try {
        const response = await api.get<{ data: AquacloudFdirBiomassPerMonth[] }>('/v3/inventory/aquacloud-fiskeridirektoratet-biomass-by-month');
        setAquacloudFdirBiomassPerMonth(response.data?.data || []);
      } catch (error) {
        console.error('[Dashboard] Failed to fetch aquacloud fiskeridirektoratet biomass per month comparison:', error);
      }
    };

    fetchAquacloudFdirBiomassPerMonth();
  }, [isKeycloakReady()]);


  useEffect(() => {
    if (!isKeycloakReady()) return;

    const fetchLossByRegion = async () => {
      try {
        const response = await api.get<{ data: LossByRegionRecord[] }>('/v3/loss-mortality/loss-by-region');
        setLossByRegion(response.data?.data || []);
      } catch (error) {
        console.error('[Dashboard] Failed to fetch loss by region:', error);
      }
    };

    fetchLossByRegion();
  }, [isKeycloakReady()]);


  useEffect(() => {
    console.log('Farmers:', farmers);
  }, [farmers]);

  return (
    <Stack gap="lg">
      {/* Top Metrics Bar */}
      <Paper p="md" radius="md" withBorder>
        <Flex gap="xl" align="center" wrap="wrap">
          <Group gap="xs">
            <Text size="sm" fw={500}>Signed farmers</Text>
            <Text size="lg" fw={700}>{farmAndSiteStats?.signed_farmers}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" fw={500}>Active farmers</Text>
            <Text size="lg" fw={700}>{farmAndSiteStats?.active_farmers}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" fw={500}>Offshore sites</Text>
            <Text size="lg" fw={700}>{farmAndSiteStats?.offshore_sites}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" fw={500}>Onshore sites</Text>
            <Text size="lg" fw={700}>{farmAndSiteStats?.onshore_sites}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" fw={500}>Recently active sites</Text>
            <Text size="lg" fw={700}>{farmAndSiteStats?.recently_active_sites}</Text>
          </Group>
        </Flex>
      </Paper>

      <LossByRegionOverview data={lossByRegion} />


      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <BiomassComparisonChart data={aquacloudFdirBiomassPerMonth} />
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
