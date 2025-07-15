import { Stack, Title, Text, Alert, Card, Group, Select, Switch, Tooltip, ActionIcon } from '@mantine/core';
import { IconInfoCircle, IconSettings, IconRefresh } from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { useMemo, useState } from 'react';
import { useLossMortalityCategoryRank } from '../hooks/lossMortality/useLossCategoryRank';

const METRIC_OPTIONS = [
  { value: 'mortality_count_rate_of_total_in_period', label: 'Andel dødelighet (antall, %)' },
  { value: 'mortality_biomass_rate_of_total_in_period', label: 'Andel dødelighet (biomasse, %)' },
  { value: 'culling_count_rate_of_total_in_period', label: 'Andel utkast (antall, %)' },
  { value: 'culling_biomass_rate_of_total_in_period', label: 'Andel utkast (biomasse, %)' },
  { value: 'loss_count_rate_of_total_in_period', label: 'Andel tap (antall, %)' },
  { value: 'loss_biomass_rate_of_total_in_period', label: 'Andel tap (biomasse, %)' },
];

export function TrendsDetailsSection() {
  const { data = [], loading, error, refetch } = useLossMortalityCategoryRank();

  // Settings state
  const [metric, setMetric] = useState<keyof typeof data[0] | string>('mortality_count_rate_of_total_in_period');
  const [useName, setUseName] = useState(false);
  const [horizontal, setHorizontal] = useState(false);
  const [showValues, setShowValues] = useState(false);

  const chart = useMemo(() => {
    // Default sort descending by metric value
    const sorted = [...data].sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0));
    return {
      categories: sorted.map(d => useName ? d.loss_category_name ?? d.loss_category_code : d.loss_category_code),
      values: sorted.map(d => Number(d[metric]) ?? 0),
    };
  }, [data, useName, metric]);

  const option = useMemo(() => ({
    grid: { left: 40, right: 20, top: 30, bottom: 80 },
    [horizontal ? 'yAxis' : 'xAxis']: {
      type: 'category',
      data: chart.categories,
      axisLabel: {
        rotate: 45,
        fontSize: 11,
        formatter: (val: string) => val.length > 18 ? val.slice(0, 16) + '…' : val,
      },
      name: 'Kategori',
    },
    [horizontal ? 'xAxis' : 'yAxis']: {
      type: 'value',
      name: 'Andel av total dødelighet',
      axisLabel: {
        formatter: (v: number) => `${(v * 100).toFixed(1)}%`,
      },
    },
    series: [
      {
        data: chart.values,
        type: 'bar',
        barWidth: '60%',
        label: showValues
          ? {
              show: true,
              position: horizontal ? 'right' : 'top',
              formatter: (params: any) => `${(params.value * 100).toFixed(1)}%`,
            }
          : undefined,
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const d = Array.isArray(params) ? params[0] : params;
        return `${d.name}<br/>Andel: <b>${(d.value * 100).toFixed(2)}%</b>`;
      },
    },
  }), [chart, horizontal, showValues]);

  return (
    <Stack gap="lg">
      <Title order={2}>Årsaksdetaljer</Title>
      <Alert color="blue" icon={<IconInfoCircle size="1rem" />}>
        Her kommer detaljerte grafer/tabeller for dødelighet etter antall og biomasse.
      </Alert>

      {/* Diagram Innstillinger */}
      <Card shadow="sm" p="md">
        <Group justify="space-between" align="center">
          <Group>
            <IconSettings size="1.2rem" />
            <Text size="lg" fw={600}>Diagram Innstillinger</Text>
          </Group>
          <Group>
            <Tooltip label="Oppdater data">
              <ActionIcon variant="light" onClick={refetch} loading={loading}>
                <IconRefresh size="1rem" />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        <Group mt="md" gap="md" align="flex-end" wrap="wrap">
          <Select
            label="Måling"
            value={metric}
            onChange={v => v && setMetric(v)}
            data={METRIC_OPTIONS}
            maw={220}
            size="sm"
          />
          <Switch
            label="Vis navn"
            checked={useName}
            onChange={e => setUseName(e.currentTarget.checked)}
            size="sm"
          />
          <Switch
            label="Horisontal"
            checked={horizontal}
            onChange={e => setHorizontal(e.currentTarget.checked)}
            size="sm"
          />
          <Switch
            label="Vis verdier"
            checked={showValues}
            onChange={e => setShowValues(e.currentTarget.checked)}
            size="sm"
          />
        </Group>
      </Card>

      {loading && <Text>Laster...</Text>}
      {error && <Alert color="red">{String(error)}</Alert>}

      {chart.values.length > 0 && (
        <ReactECharts option={option} style={{ width: '100%', height: 320 }} />
      )}
      {!loading && chart.values.length === 0 && (
        <Alert color="yellow">Ingen data</Alert>
      )}
    </Stack>
  );
}
