import { Paper, Text } from '@mantine/core';
import { PieChart } from 'aqc-charts';
import type { ChartDataPoint } from 'aqc-charts';
import type { MortalityCategoryRate } from '../../types/loss_mortality_category_rate';

interface Props {
  data: MortalityCategoryRate[];
  metricLabel: string;
  selectedMetric: keyof MortalityCategoryRate;
  grouping: 'level1' | 'code' | 'category';
}

const CHART_COLORS = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666',
  '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
  '#ea7ccc', '#2fc25b', '#ffc658', '#8884d8'
];

export function MortalityCategoryPieChart({
  data,
  metricLabel,
  selectedMetric,
  grouping
}: Props) {

  const pieChartData: ChartDataPoint[] = (() => {
    const grouped = new Map<string, number>();

    data.forEach(item => {
      let key: string;
      switch (grouping) {
        case 'level1':
          key = item.category_level_1_name;
          break;
        case 'code':
          key = item.loss_category_code[0];
          break;
        case 'category':
          key = item.category_short_name;
          break;
        default:
          key = item.category_level_1_name;
      }

      const value = item[selectedMetric] as number;
      grouped.set(key, (grouped.get(key) || 0) + (value ?? 0));
    });

    return Array.from(grouped.entries()).map(([name, value], i) => ({
      name,
      value,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
  })();

  return (
    <Paper shadow="sm" p="md" h="100%">
      <Text size="lg" fw={600} mb="md">
        {metricLabel} – Fordeling per gruppe
      </Text>

      <div style={{ height: '500px', width: '100%' }}>
        <PieChart
          data={pieChartData}
          showLegend
          center={['50%', '50%']}
          radius={['20%', '60%']}
          legendOptions={{
            type: 'scroll',
            orient: 'vertical',
            right: 20,
            top: 40,
            bottom: 20,
          }}
        />
      </div>

      <Text size="xs" c="dimmed" mt="sm">
        Viser fordeling av valgt måling for alle grupper.
      </Text>
    </Paper>
  );
}
