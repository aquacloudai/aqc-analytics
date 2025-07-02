import type { MortalityCategoryRate } from '../types/loss_mortality_category_rate';
import { groupMortalityData } from '../utils/GroupMortalityData'; // adjust path if needed

export interface ChartSeries {
  name: string;
  data: number[];
  rawData: number[];
  counts: number[];
  color: string;
}

export interface ChartData {
  categories: string[];
  series: ChartSeries[];
  metadata: {
    periodTotals: Record<string, number>;
    isFiltered: boolean;
    filterCategory: string | null;
    showAsPercentage: boolean;
    isRateMetric: boolean;
    totalsByPeriod: number[];
  };
}

const CHART_COLORS = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666',
  '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
  '#ea7ccc', '#2fc25b', '#ffc658', '#8884d8'
];


export function generateChartData(
  filteredData: MortalityCategoryRate[],
  grouping: 'level1' | 'code' | 'category' = 'level1', // default to 'level1'
  metric: keyof MortalityCategoryRate = 'loss_count',  // default metric
  showAsPercentage: boolean = true
): ChartData | null {
  if (!filteredData.length) return null;

  // Unique periods, sorted
  const periods = [...new Set(filteredData.map(d => d.period))].sort();

  // Group keys (for legend/series): get all possible groups present
  const groupLabels = new Set<string>();
  periods.forEach(period => {
    const items = filteredData.filter(d => d.period === period);
    groupMortalityData(items, grouping, metric).forEach(g => groupLabels.add(g.label));
  });
  const groupKeys = Array.from(groupLabels);

  // For chart: categories = formatted periods
  const categories = periods;

  // Build totals per period (for %)
  const periodTotals: Record<string, number> = {};
  periods.forEach(period => {
    periodTotals[period] = filteredData
      .filter(d => d.period === period)
      .reduce((sum, d) => sum + ((d[metric] as number) ?? 0), 0);
  });

  // Build series: one per groupKey
  const series: ChartSeries[] = groupKeys.map((group, idx) => {
    const data: number[] = [];
    const rawData: number[] = [];
    const counts: number[] = [];
    periods.forEach(period => {
      const items = filteredData.filter(d => d.period === period);
      const groupData = groupMortalityData(items, grouping, metric).find(g => g.label === group);
      const value = groupData?.value ?? 0;
      const total = periodTotals[period] || 1;
      data.push(showAsPercentage ? value / total : value);
      rawData.push(value);
      counts.push(value);
    });
    return {
      name: group,
      data,
      rawData,
      counts,
      color: CHART_COLORS[idx % CHART_COLORS.length]
    };
  });

  // Metadata, etc
  const totalsByPeriod = periods.map(period => periodTotals[period]);

  return {
    categories,
    series,
    metadata: {
      periodTotals,
      isFiltered: false,
      filterCategory: null,
      showAsPercentage,
      isRateMetric: metric.endsWith('_rate'), // crude check
      totalsByPeriod
    }
  };
}
