import { useEffect, useState } from 'react';
import {
  Grid, Card, Title, Text, Group, RingProgress, SimpleGrid, Paper,
} from '@mantine/core';
import {
  IconFish, IconTrendingUp, IconAlertCircle, IconDroplet,
} from '@tabler/icons-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import keycloak from '../config/keycloak';

export function Dashboard() {
  const [totalBiomass, setTotalBiomass] = useState<number | null>(null);
  const { isAuthenticated, keycloakReady } = useAuthStore();

  const [farmers, setFarmers] = useState<
  { name: string; short_name: string; number_of_farmers_in_dataset: number }[]
  >([]);



useEffect(() => {
  const fetchData = async () => {
    if (!isAuthenticated || !keycloakReady) {
      console.log('[Dashboard] Waiting for Keycloak...');
      return;
    }

    await keycloak.updateToken(0).catch((err) => {
      console.warn('[Dashboard] Token update failed or expired, triggering login.');
      keycloak.login();
      return;
    });

    if (!keycloak.token) {
      console.warn('[Dashboard] No token after update — aborting.');
      return;
    }

    console.log('[Dashboard] Auth OK. Fetching data...');


    if (!keycloak.token) {
      console.warn('[Dashboard] Still no token after update.');
      return;
    }

    console.log('[Dashboard] Auth OK. Fetching data...');
    fetchFarmers();
    fetchBiomass();
  };

  const fetchFarmers = async () => {
    try {
      const response = await api.get('/v3/common/farmers-in-aquacloud');
      setFarmers(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch farmers', error);
    }
  };

  const fetchBiomass = async () => {
    try {
      const response = await api.get('/v3/inventory/aquacloud-fiskeridirektoratet-biomass-by-month', {
        params: {
          offset: 0,
          limit: 100,
          from_month: '2024-12',
        },
      });

      const firstEntry = response.data?.results?.[0];
      if (firstEntry?.biomass) {
        setTotalBiomass(firstEntry.biomass);
      }
    } catch (error) {
      console.error('Failed to fetch biomass data', error);
    }
  };

  fetchData();
}, [isAuthenticated, keycloakReady]);

  const mockData = {
    mortalityRate: 2.3,
    feedConversion: 1.15,
    waterQuality: 85,
    growthData: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      weight: 100 + i * 5 + Math.random() * 10,
    })),
    temperatureData: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      temp: 8 + Math.sin(i / 4) * 2 + Math.random(),
    })),
  };

  const stats = [
    {
      title: 'Total Biomass',
      value: totalBiomass !== null ? `${(totalBiomass / 1000).toFixed(1)} tons` : 'Loading...',
      icon: IconFish,
      color: 'blue',
      change: '+12.5%',
    },
    {
      title: 'Mortality Rate',
      value: `${mockData.mortalityRate}%`,
      icon: IconAlertCircle,
      color: 'red',
      change: '-0.3%',
    },
    {
      title: 'Feed Conversion',
      value: mockData.feedConversion.toFixed(2),
      icon: IconTrendingUp,
      color: 'green',
      change: '+0.05',
    },
    {
      title: 'Water Quality',
      value: `${mockData.waterQuality}%`,
      icon: IconDroplet,
      color: 'cyan',
      change: '+2%',
    },
  ];

  return (
    <div>
      <Title order={1} mb="lg">Dashboard</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                  <Text c={stat.change.startsWith('+') ? 'teal' : 'red'} size="sm" mt={5}>
                    {stat.change} from last week
                  </Text>
                </div>
                <Icon size={32} color={`var(--mantine-color-${stat.color}-6)`} />
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Paper p="md" radius="md" withBorder>
            <Title order={3} mb="md">Growth Trend (30 days)</Title>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockData.growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#228be6"
                  fill="#228be6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper p="md" radius="md" withBorder h="100%">
            <Title order={3} mb="md">Water Quality Score</Title>
            <Group justify="center" mt="xl">
              <RingProgress
                size={180}
                thickness={20}
                sections={[
                  { value: mockData.waterQuality, color: 'cyan' },
                ]}
                label={
                  <Text size="xl" ta="center" fw={700}>
                    {mockData.waterQuality}%
                  </Text>
                }
              />
            </Group>
            <Text ta="center" mt="md" c="dimmed" size="sm">
              Optimal range: 80-100%
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={12}>
          <Paper p="md" radius="md" withBorder>
            <Title order={3} mb="md">Temperature (24h)</Title>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockData.temperatureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis domain={[6, 12]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#fa5252"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>
      <Grid.Col span={12}>
      <Paper p="md" radius="md" withBorder>
        <Title order={3} mb="md">Farmers in AquaCloud</Title>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Short Name</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => (
              <tr key={farmer.short_name}>
                <td style={{ padding: '8px' }}>{farmer.name}</td>
                <td style={{ padding: '8px' }}>{farmer.short_name}</td>
                <td style={{ padding: '8px' }}>{farmer.number_of_farmers_in_dataset}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </Grid.Col>


      </Grid>
    </div>
  );
}
