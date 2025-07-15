import { Stack, Title, Text, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { useLossMortalityCategoryRank } from '../hooks/lossMortality/useLossCategoryRank';

function makeMortalityCategoryBarChartData(
  data: any[],
  { useName = false, metric = 'mortality_count_rate_of_total_in_period' as const } = {}
) {
  const sorted = [...data].sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0));
  return {
    categories: sorted.map(d => useName ? d.loss_category_name ?? d.loss_category_code : d.loss_category_code),
    values: sorted.map(d => Number(d[metric]) ?? 0),
  };
}

export function TrendsDetailsSection() {
  const { data = [], loading, error } = useLossMortalityCategoryRank();

  const chart = useMemo(() => makeMortalityCategoryBarChartData(data), [data]);



  interface EChartsOption {
    grid: Record<string, number>;
    xAxis: {
      type: string;
      data: string[];
      axisLabel: {
        rotate: number;
        fontSize: number;
        formatter: (val: string) => string;
      };
      name: string;
    };
    yAxis: {
      type: string;
      name: string;
      axisLabel: {
        formatter: (v: number) => string;
      };
    };
    series: Array<{
      data: number[];
      type: string;
      barWidth: string;
    }>;
    tooltip: {
      trigger: string;
      formatter: (params: any) => string;
    };
  }

  const option: EChartsOption = useMemo(() => ({
    grid: { left: 40, right: 20, top: 30, bottom: 80 },
    xAxis: {
      type: 'category',
      data: chart.categories,
      axisLabel: {
        rotate: 45,
        fontSize: 11,
        formatter: (val: string) => val.length > 18 ? val.slice(0, 16) + '…' : val,
      },
      name: 'Kategori',
    },
    yAxis: {
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
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const d = params[0];
        return `${d.name}<br/>Andel: <b>${(d.value * 100).toFixed(2)}%</b>`;
      },
    },
  }), [chart]);

  return (
    <Stack gap="lg">
      <Title order={2}>Årsaksdetaljer</Title>
      <Alert color="blue" icon={<IconInfoCircle size="1rem" />}>
        Her kommer detaljerte grafer/tabeller for dødelighet etter antall og biomasse.
      </Alert>
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
