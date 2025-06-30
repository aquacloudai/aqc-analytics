import { Grid, Paper, Stack, Flex, Select, SegmentedControl } from '@mantine/core';
import { useLossByGeneration } from '../hooks/useLossByGeneration';
import { LineChart } from 'aqc-charts';
import { useState, useMemo } from 'react';
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

  const [generation, setGeneration] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'loss' | 'mortality' | 'culling'>('loss');
  const [period, setPeriod] = useState<'month' | 'generation_month_number'>('month');

  const generations = useMemo(() => {
    if (!lossByGeneration) return [];
    const unique = Array.from(new Set(lossByGeneration.map((d) => d.generation))).sort();
    return unique.map((g) => ({ value: g, label: g }));
  }, [lossByGeneration]);

  const filtered = useMemo(() => {
    return generation
      ? lossByGeneration?.filter((d) => d.generation === generation) ?? []
      : [];
  }, [lossByGeneration, generation]);

  const labels = filtered.map((d) =>
    period === 'month' ? d.loss_rate_month : d.generation_month_number.toString()
  );

  const { aqua, farmer, label } = metricMap[selectedMetric];

  const chartData = filtered.map((d) => {
    const label = period === 'month' ? d.loss_rate_month : d.generation_month_number.toString();
    const aquaValue = d[aqua as keyof LossMortalityGenerationRate];
    const farmerValue = d[farmer as keyof LossMortalityGenerationRate];

    const point: Record<string, string | number> = { label };

    if (typeof aquaValue === 'number') {
      point['AquaCloud'] = +(aquaValue * 100).toFixed(2);
    }
    if (typeof farmerValue === 'number') {
      point['Oppdretter'] = +(farmerValue * 100).toFixed(2);
    }

    return point;
  });

  const chartSeries = [
    {
      name: 'AquaCloud',
      type: 'line',
      data: chartData.map(d => d.AquaCloud),
    },
    {
      name: 'Oppdretter',
      type: 'line',
      data: chartData.map(d => d.Oppdretter),
    },
  ];


  console.log('chartData:', chartData);
  console.log('chartSeries:', chartSeries);


  if (loading) return <Paper p="md">Laster data...</Paper>;
  if (error) return <Paper p="md">Feil: {error}</Paper>;

  return (
    <Stack gap="lg">
      <Paper p="md" radius="md" withBorder>
        <Flex gap="lg" align="center" wrap="wrap">
          <Select
            label="Generasjon"
            placeholder="Velg generasjon"
            data={generations}
            value={generation}
            onChange={setGeneration}
            w={180}
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
            value={period}
            onChange={(value) => setPeriod(value as typeof period)}
            data={[
              { label: 'Per måned', value: 'month' },
              { label: 'Måneder siden utsett', value: 'generation_month_number' },
            ]}
          />
        </Flex>
      </Paper>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12 }}>
          {generation && chartData.length > 0 ? (
            <LineChart
              title="Test chart"
              xAxis={['Jan', 'Feb']}
              data={[
                { label: 'Jan', AquaCloud: 1.2, Oppdretter: 1.1 },
                { label: 'Feb', AquaCloud: 2.3, Oppdretter: 2.1 },
              ]}
              series={[
                { name: 'AquaCloud', dataKey: 'AquaCloud' },
                { name: 'Oppdretter', dataKey: 'Oppdretter' },
              ]}
              unit="%"
              height={300}
            />

          ) : (
            <Paper p="md" radius="md" withBorder>
              <div>
                {!generation
                  ? 'Velg en generasjon for å vise data.'
                  : 'Ingen data for valgt generasjon.'}
              </div>
            </Paper>
          )}
        </Grid.Col>




      </Grid>
    </Stack>
  );
}
