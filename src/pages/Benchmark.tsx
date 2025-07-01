import {
  Grid,
  Paper,
  Stack,
  Flex,
  MultiSelect,
  SegmentedControl,
} from '@mantine/core';
import { useLossByGeneration } from '../hooks/useLossByGeneration';
import { LineChart } from 'aqc-charts';
import { useState, useMemo, useEffect } from 'react';
import type { LossMortalityGenerationRate } from '../types/loss_mortality_generation_rate';

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
  const { data: lossByGeneration, loading, error } = useLossByGeneration();

  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'loss' | 'mortality' | 'culling'>('loss');
  const [xAxisMode, setXAxisMode] = useState<'relative' | 'calendar'>('relative');
  const [initialized, setInitialized] = useState(false);

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
        if (!d.loss_rate_month) {
          console.warn('Missing loss_rate_month data:', d);
          return null;
        }
        
        // Extract year and month from loss_rate_month
        const date = new Date(d.loss_rate_month);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date in loss_rate_month:', d.loss_rate_month);
          return null;
        }
        
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
        const key = `${year}-${String(month).padStart(2, '0')}`;
        
        if (seen.has(key)) return null;
        seen.add(key);
        return key;
      })
      .filter(Boolean) as string[];
  }

  return Array.from({ length: maxMonth + 1 }, (_, i) => i.toString());
}, [xAxisMode, filtered, maxMonth]);

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

  if (loading) return <Paper p="md">Laster data...</Paper>;
  if (error) return <Paper p="md">Feil: {error}</Paper>;

  return (
    <Stack gap="lg">
      <Paper p="md" radius="md" withBorder>
        <Flex gap="lg" align="center" wrap="wrap">
          <MultiSelect
            label="Generasjoner"
            placeholder="Velg generasjoner"
            data={generations}
            value={selectedGenerations}
            onChange={setSelectedGenerations}
            w={280}
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
          <SegmentedControl
            value={xAxisMode}
            onChange={(value) => setXAxisMode(value as 'relative' | 'calendar')}
            data={[
              { label: 'Måneder siden utsett', value: 'relative' },
              { label: 'Kalendermåneder', value: 'calendar' },
            ]}
          />
        </Flex>
      </Paper>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12 }}>
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
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
