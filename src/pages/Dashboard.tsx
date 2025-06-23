import { Grid, Card, Title, Text, Group, RingProgress, SimpleGrid, Paper } from '@mantine/core';
import { IconFish, IconTrendingUp, IconAlertCircle, IconDroplet } from '@tabler/icons-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {

  // Mock data for now - replace with actual API calls
  const mockData = {
    totalBiomass: 1250.5,
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
      value: `${mockData.totalBiomass} tons`, 
      icon: IconFish, 
      color: 'blue',
      change: '+12.5%' 
    },
    { 
      title: 'Mortality Rate', 
      value: `${mockData.mortalityRate}%`, 
      icon: IconAlertCircle, 
      color: 'red',
      change: '-0.3%' 
    },
    { 
      title: 'Feed Conversion', 
      value: mockData.feedConversion.toFixed(2), 
      icon: IconTrendingUp, 
      color: 'green',
      change: '+0.05' 
    },
    { 
      title: 'Water Quality', 
      value: `${mockData.waterQuality}%`, 
      icon: IconDroplet, 
      color: 'cyan',
      change: '+2%' 
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
      </Grid>
    </div>
  );
}