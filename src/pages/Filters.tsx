import { Title, Paper, Switch, MultiSelect, Button, Group, Stack, Text, Divider } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconRefresh } from '@tabler/icons-react';
import { useFilterStore } from '../store/filterStore';
import { useAuthStore } from '../store/authStore';
import dayjs from 'dayjs';

export function Filters() {
  const user = useAuthStore((state) => state.user);
  const {
    startDate,
    endDate,
    selectedFarms,
    selectedPens,
    selectedBatches,
    showOwnDataOnly,
    aggregationLevel,
    selectedMetrics,
    setDateRange,
    setSelectedFarms,
    setSelectedPens,
    setSelectedBatches,
    setShowOwnDataOnly,
    setAggregationLevel,
    setSelectedMetrics,
    resetFilters,
  } = useFilterStore();

  const farmOptions = [
    { value: 'farm-1', label: 'Northern Fjord Farm' },
    { value: 'farm-2', label: 'Southern Bay Farm' },
    { value: 'farm-3', label: 'Western Coast Farm' },
  ];

  const penOptions = [
    { value: 'pen-1', label: 'Pen 1' },
    { value: 'pen-2', label: 'Pen 2' },
    { value: 'pen-3', label: 'Pen 3' },
    { value: 'pen-4', label: 'Pen 4' },
  ];

  const batchOptions = [
    { value: 'batch-2024-01', label: 'Batch 2024-01' },
    { value: 'batch-2024-02', label: 'Batch 2024-02' },
    { value: 'batch-2024-03', label: 'Batch 2024-03' },
  ];

  const metricOptions = [
    { value: 'biomass', label: 'Biomass' },
    { value: 'mortality', label: 'Mortality Rate' },
    { value: 'feed-conversion', label: 'Feed Conversion Ratio' },
    { value: 'growth-rate', label: 'Growth Rate' },
    { value: 'temperature', label: 'Water Temperature' },
    { value: 'oxygen', label: 'Dissolved Oxygen' },
    { value: 'ph', label: 'pH Level' },
    { value: 'salinity', label: 'Salinity' },
  ];

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <Title order={1}>Data Filters</Title>
        <Button 
          leftSection={<IconRefresh size={16} />} 
          variant="subtle"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </Group>

      <Stack gap="lg">
        <Paper p="md" radius="md" withBorder>
          <Title order={3} mb="md">Date Range</Title>
          <Group grow>
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
          </Group>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Title order={3} mb="md">Location Filters</Title>
          <Stack>
            <MultiSelect
              label="Farms"
              placeholder="Select farms to include"
              data={farmOptions}
              value={selectedFarms}
              onChange={setSelectedFarms}
            />
            <MultiSelect
              label="Pens"
              placeholder="Select specific pens"
              data={penOptions}
              value={selectedPens}
              onChange={setSelectedPens}
            />
            <MultiSelect
              label="Batches"
              placeholder="Select fish batches"
              data={batchOptions}
              value={selectedBatches}
              onChange={setSelectedBatches}
            />
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Title order={3} mb="md">Data Options</Title>
          <Stack>
            {user?.farmerId && (
              <>
                <Switch
                  label="Show only my farm's data"
                  checked={showOwnDataOnly}
                  onChange={(e) => setShowOwnDataOnly(e.currentTarget.checked)}
                />
                <Divider />
              </>
            )}
            <div>
              <Text size="sm" fw={500} mb="xs">Aggregation Level</Text>
              <Button.Group>
                <Button 
                  variant={aggregationLevel === 'daily' ? 'filled' : 'default'}
                  onClick={() => setAggregationLevel('daily')}
                >
                  Daily
                </Button>
                <Button 
                  variant={aggregationLevel === 'weekly' ? 'filled' : 'default'}
                  onClick={() => setAggregationLevel('weekly')}
                >
                  Weekly
                </Button>
                <Button 
                  variant={aggregationLevel === 'monthly' ? 'filled' : 'default'}
                  onClick={() => setAggregationLevel('monthly')}
                >
                  Monthly
                </Button>
                <Button 
                  variant={aggregationLevel === 'yearly' ? 'filled' : 'default'}
                  onClick={() => setAggregationLevel('yearly')}
                >
                  Yearly
                </Button>
              </Button.Group>
            </div>
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Title order={3} mb="md">Metrics</Title>
          <MultiSelect
            label="Selected Metrics"
            placeholder="Choose metrics to display"
            data={metricOptions}
            value={selectedMetrics}
            onChange={setSelectedMetrics}
          />
        </Paper>
      </Stack>
    </div>
  );
}