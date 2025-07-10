import {
  Title,
  Paper,
  Stack,
  Group,
  Text,
  Loader,
  Alert,
  Card,
  Flex,
  MultiSelect,
  SegmentedControl,
  ActionIcon,
  Tooltip,
  Divider,
  Button
} from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconDownload, IconInfoCircle } from '@tabler/icons-react';
import { useLossByGeneration } from '../hooks/useLossByGeneration';
import { LineChart } from 'aqc-charts';
import { useState, useMemo, useEffect } from 'react';
import type { LossMortalityGenerationRate } from '../types/loss_mortality_generation_rate';
import { downloadChartData } from '../utils/downloadCSV'; // If you want a CSV export
import { ApiInfoModal } from '../components/ApiInfoModal';

const metricMap = {
  loss: {
    aqua: 'cumulative_loss_rate',
    farmer: 'farmer_cumulative_loss_rate',
    label: 'Akkumulert tap',
  },
  mortality: {
    aqua: 'cumulative_mortality_rate',
    farmer: 'farmer_cumulative_mortality_rate',
    label: 'Akkumulert dødelighet',
  },
  culling: {
    aqua: 'cumulative_culling_rate',
    farmer: 'farmer_cumulative_culling_rate',
    label: 'Akkumulert utslakting',
  },
};

export function Benchmark() {
  const { data: lossByGeneration = [], loading, error, refetch, apiDetails } = useLossByGeneration();

  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'loss' | 'mortality' | 'culling'>('loss');
  const [xAxisMode, setXAxisMode] = useState<'relative' | 'calendar'>('relative');
  const [initialized, setInitialized] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);


  // Generate generations list
  const generations = useMemo(() => {
    if (!lossByGeneration) return [];
    const unique = Array.from(new Set(lossByGeneration.map((d) => d.generation))).sort();
    return unique.map((g) => ({ value: g, label: g }));
  }, [lossByGeneration]);

  useEffect(() => {
    if (!initialized && generations.length > 0 && selectedGenerations.length === 0) {
      const hasH2024 = generations.some((g) => g.value === 'H2024');
      setSelectedGenerations([hasH2024 ? 'H2024' : generations[0].value]);
      setInitialized(true);
    }
  }, [generations, initialized, selectedGenerations.length]);

  // Filter by selected generations
  const filtered = useMemo(() => {
    return selectedGenerations.length > 0
      ? lossByGeneration?.filter((d) => selectedGenerations.includes(d.generation)) ?? []
      : [];
  }, [lossByGeneration, selectedGenerations]);

  const { aqua, farmer, label } = metricMap[selectedMetric];

  const maxMonth = useMemo(() => {
    if (filtered.length === 0) return 0;
    return Math.max(...filtered.map((d) => d.generation_month_number));
  }, [filtered]);

  const categories = useMemo(() => {
    if (xAxisMode === 'calendar') {
      if (filtered.length === 0) return [];
      const sorted = [...filtered].sort((a, b) => a.generation_month_number - b.generation_month_number);
      const seen = new Set();
      return sorted
        .map(d => {
          if (!d.loss_rate_month) return null;
          const date = new Date(d.loss_rate_month);
          if (isNaN(date.getTime())) return null;
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const key = `${year}-${String(month).padStart(2, '0')}`;
          if (seen.has(key)) return null;
          seen.add(key);
          return key;
        })
        .filter(Boolean) as string[];
    }
    return Array.from({ length: maxMonth + 1 }, (_, i) => i.toString());
  }, [xAxisMode, filtered, maxMonth]);

  // Prepare series for the chart
  const chartSeries = useMemo(() => {
    if (selectedGenerations.length === 0) return [];
    const series: Array<{ name: string; type: string; data: number[] }> = [];
    selectedGenerations.forEach((generation) => {
      const generationData = filtered.filter((d) => d.generation === generation);
      const aquaData = categories.map((xValue) => {
        const dataPoint =
          xAxisMode === 'calendar'
            ? generationData.find((d) => {
              if (!d.loss_rate_month) return false;
              const date = new Date(d.loss_rate_month);
              if (isNaN(date.getTime())) return false;
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              const key = `${year}-${String(month).padStart(2, '0')}`;
              return key === xValue;
            })
            : generationData.find(
              (d) => d.generation_month_number === parseInt(xValue)
            );
        const aquaValue = dataPoint?.[aqua as keyof LossMortalityGenerationRate];
        return typeof aquaValue === 'number' ? +(aquaValue * 100).toFixed(2) : 0;
      });
      const farmerData = categories.map((xValue) => {
        const dataPoint =
          xAxisMode === 'calendar'
            ? generationData.find((d) => {
              if (!d.loss_rate_month) return false;
              const date = new Date(d.loss_rate_month);
              if (isNaN(date.getTime())) return false;
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              const key = `${year}-${String(month).padStart(2, '0')}`;
              return key === xValue;
            })
            : generationData.find(
              (d) => d.generation_month_number === parseInt(xValue)
            );
        const farmerValue = dataPoint?.[farmer as keyof LossMortalityGenerationRate];
        return typeof farmerValue === 'number' ? +(farmerValue * 100).toFixed(2) : 0;
      });
      series.push({
        name: `${generation} - AquaCloud`,
        type: 'line',
        data: aquaData,
      });
      series.push({
        name: `${generation} - Oppdretter`,
        type: 'line',
        data: farmerData,
      });
    });
    return series;
  }, [selectedGenerations, filtered, categories, aqua, farmer, xAxisMode]);

  // Optional: summary stats, matching Trends
  const summaryStats = useMemo(() => {
    if (!filtered.length) return null;
    return {
      totalGenerations: new Set(filtered.map(d => d.generation)).size,
      totalPoints: filtered.length,
      minMonth: Math.min(...filtered.map(d => d.generation_month_number)),
      maxMonth: Math.max(...filtered.map(d => d.generation_month_number)),
    };
  }, [filtered]);

  if (loading) {
    return (
      <Stack align="center" mt="xl">
        <Loader size="lg" />
        <Text>Laster generasjonsdata...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Feil" color="red" mt="lg">
        {error}
        <Button
          variant="light"
          size="xs"
          onClick={refetch}
          leftSection={<IconRefresh size="1rem" />}
          mt="md"
        >
          Prøv igjen
        </Button>
      </Alert>
    );
  }

  // ---- Main Page ----
  return (
    <Stack gap="lg">
      {/* Page Header */}
      <Group justify="space-between" align="flex-end">
        <Title order={1}>
          Benchmark: Generasjoner
          {summaryStats && (
            <Text size="sm" c="dimmed" component="span" ml="sm">
              ({summaryStats.totalGenerations} generasjoner, {summaryStats.totalPoints} datapunkter)
            </Text>
          )}
        </Title>
        <Group>
          <Tooltip label="Oppdater data">
            <ActionIcon variant="light" onClick={refetch} loading={loading}>
              <IconRefresh size="1rem" />
            </ActionIcon>
          </Tooltip>
          {filtered.length > 0 && (
            <Group>
              <Button
                leftSection={<IconDownload size="1rem" />}
                variant="light"
                onClick={() => downloadChartData(filtered, 'generations_benchmark.csv')}
              >
                Last ned CSV
              </Button>
              <Button
                leftSection={<IconInfoCircle size="1rem" />}
                variant="light"
                onClick={() => setShowApiModal(true)}
              >
                Vis API-kall
              </Button>
            </Group>
          )}
        </Group>
      </Group>

      {/* Configuration Panel */}
      <Card shadow="sm" p="md">
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group>
              <Text size="lg" fw={600}>
                Diagram Innstillinger
              </Text>
            </Group>
          </Group>
          <Flex gap="lg" align="center" wrap="wrap">
            <MultiSelect
              label="Generasjoner"
              placeholder="Velg generasjoner"
              data={generations}
              value={selectedGenerations}
              onChange={setSelectedGenerations}
              w={260}
              searchable
              clearable
            />
            <SegmentedControl
              value={selectedMetric}
              onChange={(value) => setSelectedMetric(value as typeof selectedMetric)}
              data={[
                { label: 'Tap', value: 'loss' },
                { label: 'Dødelighet', value: 'mortality' },
                { label: 'Utslakting', value: 'culling' },
              ]}
            />
            <div>
              <Text size="sm" mb={4}>X-akse</Text>
              <SegmentedControl
                value={xAxisMode}
                onChange={(value) => setXAxisMode(value as 'relative' | 'calendar')}
                data={[
                  { label: 'Måneder siden utsett', value: 'relative' },
                  { label: 'Kalendermåneder', value: 'calendar' },
                ]}
              />
            </div>
          </Flex>
        </Stack>
      </Card>

      {/* Chart */}
      <Paper shadow="sm" p="md">
        <Text size="lg" fw={600} mb="md">
          {label}
        </Text>
        {selectedGenerations.length > 0 && chartSeries.length > 0 ? (
          <LineChart
            title={`${label} - ${xAxisMode === 'relative' ? 'Måneder siden utsett' : 'Kalendermåneder'}`}
            data={{
              categories: categories,
              series: chartSeries,
            }}
            unit="%"
            height={400}
            xAxisTitle={xAxisMode === 'relative' ? 'Måned siden utsett' : 'Kalendermåned'}
            yAxisTitle={label}
          />
        ) : (
          <Paper p="md" radius="md" withBorder>
            <div>
              {selectedGenerations.length === 0
                ? 'Velg minst én generasjon for å vise data.'
                : 'Ingen data for valgte generasjoner.'}
            </div>
          </Paper>
        )}
      </Paper>
      <ApiInfoModal
        opened={showApiModal}
        onClose={() => setShowApiModal(false)}
        apiDetails={[apiDetails]}
      />
    </Stack>
  );
}
