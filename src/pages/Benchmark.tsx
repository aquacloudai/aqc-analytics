import { Grid, Paper, Stack, Flex, Select, SegmentedControl } from '@mantine/core';
import { useLossByGeneration } from '../hooks/useLossByGeneration';
import { LineChart } from 'aqc-charts';
import { useState, useMemo } from 'react';

export function Benchmark() {
  const { data: lossByGeneration, loading, error } = useLossByGeneration();

  const [generation, setGeneration] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'loss' | 'mortality' | 'culling'>('loss');
  const [period, setPeriod] = useState<'month' | 'generation_month_number'>('month');

  const generations = useMemo(() => {
    if (!lossByGeneration) return [];
    const unique = Array.from(new Set(lossByGeneration.map(d => d.generation))).sort();
    return unique.map(g => ({ value: g, label: g }));
  }, [lossByGeneration]);

  const filtered = useMemo(() => {
    return generation
      ? lossByGeneration?.filter((d) => d.generation === generation) ?? []
      : [];
  }, [lossByGeneration, generation]);

  const labels = filtered.map((d) =>
    period === 'month' ? d.loss_rate_month : d.generation_month_number
  );

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

  const { aqua, farmer, label } = metricMap[selectedMetric];

  const aquacloudData = filtered.map((d) =>
    typeof d[aqua as keyof typeof d] === 'number' ? +((d[aqua as keyof typeof d] as number) * 100).toFixed(2) : null
  );

  const farmerData = filtered.map((d) =>
    typeof d[farmer as keyof typeof d] === 'number' ? +((d[farmer as keyof typeof d] as number) * 100).toFixed(2) : null
  );

  const hasValidFarmerData = farmerData.some(value => value !== null);

  // Create chart data with the processed values
  const chartData = labels.map((label, i) => ({
    label,
    aquacloud: aquacloudData[i],
    farmer: hasValidFarmerData ? farmerData[i] : null,
  }));

  // Series should only use dataKey when providing data prop to LineChart
  const chartSeries = [
    { 
      name: 'AquaCloud', 
      dataKey: 'aquacloud' 
    },
    ...(hasValidFarmerData
      ? [{ 
          name: 'Oppdretter', 
          dataKey: 'farmer', 
          line: { dash: 'dot' } 
        }]
      : []),
  ];

  if (loading) {
    return <Paper p="md">Laster data...</Paper>;
  }

  if (error) {
    return <Paper p="md">Feil: {error}</Paper>;
  }

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
          {generation && filtered.length > 0 ? (
            <LineChart
              title={`${label} over tid (${generation})`}
              xAxis={labels}
              series={chartSeries}
              data={chartData}
              height={400}
              unit="%"
            />
          ) : (
            <Paper p="md" radius="md" withBorder>
              <div>
                {!generation 
                  ? "Velg en generasjon for å vise data." 
                  : "Ingen data for valgt generasjon."
                }
              </div>
            </Paper>
          )}
        </Grid.Col>
      </Grid>
    </Stack>
  );
}