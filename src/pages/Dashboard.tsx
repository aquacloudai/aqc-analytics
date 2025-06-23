import { 
  Grid, 
  Card, 
  Title, 
  Text, 
  Group, 
  SimpleGrid, 
  Paper, 
  Stack, 
  Box,
  Badge,
  Table,
  ScrollArea,
  Flex
} from '@mantine/core';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

export function Dashboard() {
  const { colorScheme } = useTheme();

  // Mock data based on the screenshot
  const topMetrics = [
    { label: 'Active operations', value: 28 },
    { label: 'Deployed facilities', value: 479 },
    { label: 'Spooled facilities', value: 437 },
    { label: 'New sites local', value: 12.9 },
    { label: '', value: 13.1 },
    { label: '', value: 13.2 },
    { label: '', value: 11.2 },
    { label: '', value: 11.3 },
    { label: '', value: 11.4 },
    { label: '', value: 10.3 },
    { label: '', value: 10 },
    { label: '', value: 8.9 },
    { label: '', value: 8.4 },
    { label: '', value: 8.7 },
  ];

  const biomassData = [
    { month: 'Jul 2024', value: 0.6 },
    { month: 'Sep 2024', value: 0.5 },
    { month: 'Nov 2024', value: 0.4 },
    { month: 'Jan 2025', value: 0.3 },
    { month: 'Mar 2025', value: 0.2 },
    { month: 'May 2025', value: 0.1 },
  ];

  const mortalityRegions = [
    { 
      title: 'Mortality Norway', 
      current: '10.7%', 
      previous: '9.7%',
      change: '+1.0%',
      status: 'increase',
      updated: 'Jul 2024'
    },
    { 
      title: 'Mortality Norway', 
      current: '0.8%', 
      previous: '1.2%',
      change: '-0.4%',
      status: 'decrease',
      updated: 'May 2024'
    },
    { 
      title: 'Mortality Regional South', 
      current: '11.7%', 
      previous: '10.4%',
      change: '+1.3%',
      status: 'increase',
      updated: 'Jul 2024'
    },
    { 
      title: 'Mortality Regional South', 
      current: '0.9%', 
      previous: '0.7%',
      change: '+0.2%',
      status: 'increase',
      updated: 'May 2024'
    },
    {
      title: 'Mortality Regional Middle',
      current: '11.4%',
      previous: '10.8%', 
      change: '+0.6%',
      status: 'increase',
      updated: 'Jul 2024'
    },
    {
      title: 'Mortality Regional Middle',
      current: '0.6%',
      previous: '0.4%',
      change: '+0.2%', 
      status: 'increase',
      updated: 'May 2024'
    },
    {
      title: 'Mortality Regional North',
      current: '9.3%',
      previous: '8.9%',
      change: '+0.4%',
      status: 'increase', 
      updated: 'Jul 2024'
    },
    {
      title: 'Mortality Regional North',
      current: '0.9%',
      previous: '0.7%',
      change: '+0.2%',
      status: 'increase',
      updated: 'May 2024'
    }
  ];

  const historyData = [
    { date: 'Jan 2021', Mid: 12, North: 10, Norway: 11, South: 13 },
    { date: 'Jul 2021', Mid: 13, North: 11, Norway: 12, South: 14 },
    { date: 'Jan 2022', Mid: 11, North: 9, Norway: 10, South: 12 },
    { date: 'Jul 2022', Mid: 12, North: 10, Norway: 11, South: 13 },
    { date: 'Jan 2023', Mid: 13, North: 11, Norway: 12, South: 14 },
    { date: 'Jul 2023', Mid: 12, North: 10, Norway: 11, South: 13 },
    { date: 'Jan 2024', Mid: 11, North: 9, Norway: 10, South: 12 },
    { date: 'Jul 2024', Mid: 10, North: 8, Norway: 9, South: 11 },
    { date: 'Jan 2025', Mid: 9, North: 7, Norway: 8, South: 10 },
  ];

  const tempData = [
    { date: 'Jul 2024', Mid: 14, North: 16, Norway: 15, South: 13 },
    { date: 'Sep 2024', Mid: 12, North: 14, Norway: 13, South: 11 },
    { date: 'Nov 2024', Mid: 10, North: 12, Norway: 11, South: 9 },
    { date: 'Jan 2025', Mid: 8, North: 10, Norway: 9, South: 7 },
    { date: 'Mar 2025', Mid: 10, North: 12, Norway: 11, South: 9 },
    { date: 'May 2025', Mid: 12, North: 14, Norway: 13, South: 11 },
  ];

  const operators = [
    { name: 'AkvaAkva', region: 'Mid', po: 8, active: true },
    { name: 'AquaGen', region: 'Mid', po: 6, active: true },
    { name: 'Baeroya', region: 'Mid', po: 6.7, active: true },
    { name: 'Bjørn Fiskereoppdrett', region: 'South', po: 4, active: true },
    { name: 'Bolaks', region: 'South', po: 3, active: true },
    { name: 'Brødrene Seashore', region: 'South', po: 2.3, active: true },
    { name: 'Cermaq', region: 'North', po: 7.12, active: true },
    { name: 'Emblom Fisk', region: 'Mid', po: 7, active: true },
    { name: 'Grøntvedt AS', region: 'North', po: 10, active: true },
    { name: 'Grieg Seafood', region: 'North, South', po: 2.12, active: true },
    { name: 'Hofseth Aqua', region: 'Mid', po: 5, active: true },
    { name: 'Måløy Fiskdefarm', region: 'North', po: 10, active: true },
    { name: 'Kvarøy', region: 'Mid', po: 6, active: true },
  ];

  return (
    <Stack gap="lg">
      {/* Top Metrics Bar */}
      <Paper p="md" radius="md" withBorder>
        <Flex gap="xl" align="center" wrap="wrap">
          <Group gap="xs">
            <Text size="sm" fw={500}>Active operations</Text>
            <Text size="lg" fw={700}>{topMetrics[0].value}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" fw={500}>Deployed facilities</Text>
            <Text size="lg" fw={700}>{topMetrics[1].value}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" fw={500}>New sites located</Text>
            <Text size="lg" fw={700}>{topMetrics[3].value}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" fw={500}>Product/service size</Text>
            <Text size="lg" fw={700}>{topMetrics[4].value}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" fw={500}>Temperature</Text>
            <Text size="lg" fw={700}>{topMetrics[5].value}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" fw={500}>Production/consumption sites</Text>
            <Text size="lg" fw={700}>{topMetrics[6].value}</Text>
          </Group>
        </Flex>
      </Paper>

      <Grid gutter="lg">
        {/* Left side - Mortality cards and charts */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="lg">
            {/* Mortality Rate Cards */}
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
              {mortalityRegions.map((region, index) => (
                <Card key={index} padding="md" radius="md" withBorder>
                  <Stack gap="xs">
                    <Text size="sm" fw={500} style={{ minHeight: '32px' }}>
                      {region.title}
                    </Text>
                    <Text size="xl" fw={700} c={region.status === 'increase' ? 'red' : 'green'}>
                      {region.current}
                    </Text>
                    <Badge 
                      size="xs" 
                      color={region.status === 'increase' ? 'red' : 'green'}
                      variant="light"
                    >
                      {region.change}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      {region.updated}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>

            {/* Historical Mortality Chart */}
            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={4}>Mortality Development</Title>
                <Group gap="xs">
                  <Text size="xs">Include destruction/calling</Text>
                  <Badge size="xs" variant="outline">ON</Badge>
                </Group>
              </Group>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colorScheme === 'dark' ? '#90d0d7' : '#e9ecef'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={colorScheme === 'dark' ? '#90d0d7' : '#495057'}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={colorScheme === 'dark' ? '#90d0d7' : '#495057'}
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: colorScheme === 'dark' ? '#014059' : '#ffffff',
                      border: '1px solid #90d0d7',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Mid" stroke="#228be6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="North" stroke="#fa5252" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Norway" stroke="#40c057" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="South" stroke="#fd7e14" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Stack>
        </Grid.Col>

        {/* Right side - Biomass and Temperature */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="lg">
            {/* Biomass Development */}
            <Paper p="md" radius="md" withBorder>
              <Title order={4} mb="md">Biomass development per month</Title>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={biomassData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colorScheme === 'dark' ? '#90d0d7' : '#e9ecef'} />
                  <XAxis 
                    dataKey="month" 
                    stroke={colorScheme === 'dark' ? '#90d0d7' : '#495057'}
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke={colorScheme === 'dark' ? '#90d0d7' : '#495057'}
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: colorScheme === 'dark' ? '#014059' : '#ffffff',
                      border: '1px solid #90d0d7',
                      borderRadius: '4px'
                    }}
                  />
                  <Bar dataKey="value" fill="#90d0d7" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>

            {/* Temperature Development */}
            <Paper p="md" radius="md" withBorder>
              <Title order={4} mb="md">Temperature development last 12 months</Title>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={tempData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colorScheme === 'dark' ? '#90d0d7' : '#e9ecef'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={colorScheme === 'dark' ? '#90d0d7' : '#495057'}
                    fontSize={10}
                  />
                  <YAxis 
                    stroke={colorScheme === 'dark' ? '#90d0d7' : '#495057'}
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: colorScheme === 'dark' ? '#014059' : '#ffffff',
                      border: '1px solid #90d0d7',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Mid" stroke="#228be6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="North" stroke="#fa5252" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Norway" stroke="#40c057" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="South" stroke="#fd7e14" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>

      <Grid gutter="lg">
        {/* Location Map placeholder */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper p="md" radius="md" withBorder>
            <Title order={4} mb="md">Location Map</Title>
            <Box 
              h={300} 
              style={{ 
                backgroundColor: colorScheme === 'dark' ? '#014059' : '#f8f9fa',
                border: '1px solid #90d0d7',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text c="dimmed">Interactive map will be implemented here</Text>
            </Box>
          </Paper>
        </Grid.Col>

        {/* Operators Table */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper p="md" radius="md" withBorder>
            <Title order={4} mb="md">Farm Operators in AquaCloud</Title>
            <ScrollArea h={300}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Region(s)</Table.Th>
                    <Table.Th>PO</Table.Th>
                    <Table.Th>Active</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {operators.map((operator, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{operator.name}</Table.Td>
                      <Table.Td>{operator.region}</Table.Td>
                      <Table.Td>{operator.po}</Table.Td>
                      <Table.Td>
                        <Badge 
                          color={operator.active ? 'green' : 'red'} 
                          size="sm"
                          variant="light"
                        >
                          {operator.active ? '✓' : '✗'}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}