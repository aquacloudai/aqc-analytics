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
    const grouped = new Map<string, { label: string; value: number }>();

    data.forEach(item => {
      let key: string;
      let label: string;

      switch (grouping) {
        case 'level1':
          key = item.category_level_1_name;
          label = item.category_level_1_name;
          break;
        case 'code':
          key = item.loss_category_code;
          label = `${item.loss_category_code} - ${item.category_short_name}`;
          break;
        case 'category':
          key = item.category_short_name;
          label = item.category_short_name;
          break;
        default:
          key = item.category_level_1_name;
          label = item.category_level_1_name;
      }

      const value = item[selectedMetric] as number;
      if (!value || value === 0) return; // ❗ Skip zero values

      if (grouped.has(key)) {
        grouped.get(key)!.value += value;
      } else {
        grouped.set(key, { label, value });
      }
    });

    const all = Array.from(grouped.values());
    const total = all.reduce((sum, { value }) => sum + value, 0);

    const mainItems: ChartDataPoint[] = [];
    let otherTotal = 0;

    all.forEach(({ label, value }, i) => {
      const percentage = (value / total) * 100;

      if (percentage < 0.3) {
        otherTotal += value;
      } else {
        mainItems.push({
          name: label,
          value,
          color: CHART_COLORS[mainItems.length % CHART_COLORS.length],
        });
      }
    });

    if (otherTotal > 0) {
      mainItems.push({
        name: 'Annet',
        value: otherTotal,
        color: '#cccccc', // Neutral gray for 'Other'
      });
    }

    return mainItems;
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
          center={['40%', '60%']}
          radius={['30%', '80%']}
          legendOptions={{
            type: 'scroll',
            orient: 'vertical',
            right: 30,
            top: 40,
            bottom: 20,
          }}
        />
      </div>

      <Text size="xs" c="dimmed" mt="sm">
        Viser fordeling av valgt måling over hele perioden. Grupper under 0.3% er samlet som "Annet".
      </Text>

    </Paper>
  );
}
