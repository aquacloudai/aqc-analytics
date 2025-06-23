import { Title, Paper, Tabs, Group, MultiSelect, SegmentedControl, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconChartLine, IconChartBar, IconChartDots } from '@tabler/icons-react';
import { useFilterStore } from '../store/filterStore';
import dayjs from 'dayjs';

export function Analytics() {
  const { 
    startDate, 
    endDate, 
    selectedFarms,
    selectedMetrics,
    aggregationLevel,
    setDateRange,
    setSelectedFarms,
    setSelectedMetrics,
    setAggregationLevel
  } = useFilterStore();

  const farmOptions = [
    { value: 'farm-1', label: 'Northern Fjord Farm' },
    { value: 'farm-2', label: 'Southern Bay Farm' },
    { value: 'farm-3', label: 'Western Coast Farm' },
  ];

  const metricOptions = [
    { value: 'biomass', label: 'Biomass' },
    { value: 'mortality', label: 'Mortality Rate' },
    { value: 'feed-conversion', label: 'Feed Conversion Ratio' },
    { value: 'growth-rate', label: 'Growth Rate' },
    { value: 'temperature', label: 'Water Temperature' },
    { value: 'oxygen', label: 'Dissolved Oxygen' },
  ];

  return (
    <div>
      <Title order={1} mb="lg">Analytics</Title>

      <Paper p="md" radius="md" withBorder mb="lg">
        <Group grow align="flex-end">
          <DatePickerInput
            label="Start Date"
            value={startDate?.toDate()}
            onChange={(date) => setDateRange(date ? dayjs(date) : null, endDate)}
          />
          <DatePickerInput
            label="End Date"
            value={endDate?.toDate()}
            onChange={(date) => setDateRange(startDate, date ? dayjs(date) : null)}
          />
          <MultiSelect
            label="Farms"
            placeholder="Select farms"
            data={farmOptions}
            value={selectedFarms}
            onChange={setSelectedFarms}
          />
          <SegmentedControl
            value={aggregationLevel}
            onChange={(value) => setAggregationLevel(value as any)}
            data={[
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
            ]}
          />
        </Group>

        <MultiSelect
          label="Metrics"
          placeholder="Select metrics to display"
          data={metricOptions}
          value={selectedMetrics}
          onChange={setSelectedMetrics}
          mt="md"
        />
      </Paper>

      <Tabs defaultValue="trends">
        <Tabs.List>
          <Tabs.Tab value="trends" leftSection={<IconChartLine size={16} />}>
            Trends
          </Tabs.Tab>
          <Tabs.Tab value="comparison" leftSection={<IconChartBar size={16} />}>
            Comparison
          </Tabs.Tab>
          <Tabs.Tab value="correlation" leftSection={<IconChartDots size={16} />}>
            Correlation
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="trends" pt="xl">
          <Paper p="md" radius="md" withBorder>
            <Title order={3} mb="md">Trend Analysis</Title>
            <Text c="dimmed">Select metrics and date range to view trends</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="comparison" pt="xl">
          <Paper p="md" radius="md" withBorder>
            <Title order={3} mb="md">Farm Comparison</Title>
            <Text c="dimmed">Compare performance across selected farms</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="correlation" pt="xl">
          <Paper p="md" radius="md" withBorder>
            <Title order={3} mb="md">Metric Correlation</Title>
            <Text c="dimmed">Analyze relationships between different metrics</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}