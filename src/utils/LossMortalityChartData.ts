import type { MortalityCategoryRate } from '../types/loss_mortality_category_rate';
import { groupMortalityData } from '../utils/GroupMortalityData';
import type { LossMortalityCategoryBySize } from '../types/loss_mortality_category_by_size';

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


export function generateSizeDistributionChartData(data: LossMortalityCategoryBySize[]) {
    if (!data || data.length === 0) return { categories: [], series: [] };

    // 1. Find all unique weight buckets (sorted)
    const weightBuckets = Array.from(new Set(data.map(d => d.weight_group))).sort((a, b) => a - b);

    // 2. Find all unique categories (keep both code and name)
    const uniqueCategories = Array.from(
        new Map(data.map(d => [d.category_code_level_1, d.category_name])).entries()
    );

    // 3. Build: { [bucket]: { [cat]: sum(rate) } }
    const agg: Record<number, Record<string, number>> = {};
    for (const d of data) {
        const bucket = d.weight_group;
        const cat = d.category_code_level_1;
        if (!agg[bucket]) agg[bucket] = {};
        if (!agg[bucket][cat]) agg[bucket][cat] = 0;
        agg[bucket][cat] += d.rate ?? 0;
    }

    // 4. Compute total rate per bucket (for percent calculation)
    const totals: Record<number, number> = {};
    for (const bucket of weightBuckets) {
        totals[bucket] = uniqueCategories.reduce((sum, [cat]) => sum + (agg[bucket]?.[cat] ?? 0), 0);
    }

    // 5. Build chart series: one per category
    const colors = [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#2fc25b', '#ffc658', '#8884d8'
    ];
    const series = uniqueCategories.map(([cat, name], idx) => ({
        name: name,    // You can use cat here if you want codes instead
        data: weightBuckets.map(bucket => {
            const value = agg[bucket]?.[cat] ?? 0;
            const total = totals[bucket] || 1;
            return total > 0 ? value / total : 0; // as percent, 0..1
        }),
        color: colors[idx % colors.length]
    }));

    // 6. Format buckets for x-axis label, e.g. '0g', '100g', etc.
    const categories = weightBuckets.map(b => `${b}g`);

    return { categories, series };
}



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
