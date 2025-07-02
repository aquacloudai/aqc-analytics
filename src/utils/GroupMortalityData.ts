import type { MortalityCategoryRate } from '../types/loss_mortality_category_rate';

export function groupMortalityData(
  data: MortalityCategoryRate[],
  grouping: 'level1' | 'code' | 'category',
  metric: keyof MortalityCategoryRate
) {
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

    const value = item[metric] as number;
    if (!value || value === 0) return;

    if (grouped.has(key)) {
      grouped.get(key)!.value += value;
    } else {
      grouped.set(key, { label, value });
    }
  });

  return Array.from(grouped.values());
}
