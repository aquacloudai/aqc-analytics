import { Paper, Text, Group, Badge, Stack, Select, Switch, NumberInput } from '@mantine/core';
import { SankeyChart } from 'aqc-charts';
import { useState, useMemo } from 'react';
import type { MortalityCategoryRate } from '../../types/loss_mortality_category_rate';
import type { SankeyChartProps } from 'aqc-charts';

interface Props {
  data: MortalityCategoryRate[];
  showFarmerData?: boolean;
  topN?: number;
}

type MetricType = 'loss_count' | 'mortality_count' | 'culling_count';
type WeightType = 'count' | 'weight';

export function MortalitySankeyChart({ data, showFarmerData = false, topN = 25 }: Props) {
  const [metric, setMetric] = useState<MetricType>('loss_count');
  const [weightType, setWeightType] = useState<WeightType>('count');
  const [showPercentages, setShowPercentages] = useState(true);
  const [minThreshold, setMinThreshold] = useState(1000);

  const sankeyData = useMemo(() => {
    // Helper function to get the appropriate value
    const getValue = (item: MortalityCategoryRate) => {
      const baseKey = showFarmerData ? 'farmer_' : '';
      
      if (weightType === 'weight') {
        // Calculate total weight = count * average weight
        const countKey = `${baseKey}${metric}` as keyof MortalityCategoryRate;
        const weightKey = `${baseKey}${metric.replace('_count', '_avg_weight_gram')}` as keyof MortalityCategoryRate;
        
        const count = item[countKey] as number || 0;
        const avgWeight = item[weightKey] as number || 0;
        
        return count * avgWeight / 1000; // Convert to kg
      } else {
        const countKey = `${baseKey}${metric}` as keyof MortalityCategoryRate;
        return item[countKey] as number || 0;
      }
    };

    // 1. Group and sum flow data
    const grouped = new Map<string, { source: string; target: string; value: number; items: MortalityCategoryRate[] }>();
    let totalValue = 0;

    for (const item of data) {
      const category = item.category_level_1_name;
      const subcategory = item.category_short_name || item.category_name; // Use short name if available
      const value = getValue(item);

      if (!category || !subcategory || value < minThreshold) continue;

      totalValue += value;
      const key = `${category} → ${subcategory}`;
      
      if (!grouped.has(key)) {
        grouped.set(key, { source: category, target: subcategory, value: 0, items: [] });
      }

      const existing = grouped.get(key)!;
      existing.value += value;
      existing.items.push(item);
    }

    // 2. Sort and take top N
    const allLinks = [...grouped.values()].sort((a, b) => b.value - a.value);
    const topLinks = allLinks.slice(0, topN);
    const otherLinks = allLinks.slice(topN);

    // 3. Group remaining as "Andre"
    const otherGrouped = new Map<string, { value: number; items: MortalityCategoryRate[] }>();
    for (const link of otherLinks) {
      const key = link.source;
      if (!otherGrouped.has(key)) {
        otherGrouped.set(key, { value: 0, items: [] });
      }
      const existing = otherGrouped.get(key)!;
      existing.value += link.value;
      existing.items.push(...link.items);
    }

    const otherLinksCollapsed: SankeyChartProps['data']['links'] = [...otherGrouped.entries()].map(([source, data]) => ({
      source,
      target: 'Andre kategorier',
      value: data.value
    }));

    const finalLinks = [...topLinks.map(link => ({
      source: link.source,
      target: link.target,
      value: link.value
    })), ...otherLinksCollapsed];

    // 4. Create nodes with enhanced information
    const nodeMap = new Map<string, { name: string; value: number; isMainCategory: boolean }>();
    
    finalLinks.forEach(link => {
      const sourceName = String(link.source);
      const targetName = String(link.target);
      
      // Source nodes (main categories)
      if (!nodeMap.has(sourceName)) {
        nodeMap.set(sourceName, { name: sourceName, value: 0, isMainCategory: true });
      }
      nodeMap.get(sourceName)!.value += link.value;
      
      // Target nodes (subcategories)
      if (!nodeMap.has(targetName)) {
        nodeMap.set(targetName, { name: targetName, value: 0, isMainCategory: false });
      }
      if (!nodeMap.get(targetName)!.isMainCategory) {
        nodeMap.get(targetName)!.value += link.value;
      }
    });

    const nodeArray: SankeyChartProps['data']['nodes'] = [...nodeMap.values()].map(node => ({
      name: showPercentages && totalValue > 0 
        ? `${node.name}\n(${((node.value / totalValue) * 100).toFixed(1)}%)`
        : node.name
    }));

    return { nodes: nodeArray, links: finalLinks, totalValue };
  }, [data, showFarmerData, metric, weightType, showPercentages, minThreshold, topN]);

  const getMetricLabel = () => {
    const base = metric.replace('_count', '');
    const dataSource = showFarmerData ? 'oppdretterrapporterte' : 'totale';
    const unit = weightType === 'weight' ? 'kg' : 'antall';
    
    return `${dataSource} ${base} (${unit})`;
  };

  const getMetricColor = () => {
    switch (metric) {
      case 'loss_count': return 'red';
      case 'mortality_count': return 'dark';
      case 'culling_count': return 'orange';
      default: return 'blue';
    }
  };

  return (
    <Paper shadow="sm" p="md">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text size="lg" fw={600}>
            Fordeling av {getMetricLabel()} per kategori
          </Text>
          <Badge color={getMetricColor()} variant="light">
            {sankeyData.totalValue.toLocaleString()} {weightType === 'weight' ? 'kg' : 'enheter'}
          </Badge>
        </Group>

        {/* Controls */}
        <Group gap="md" wrap="wrap">
          <Select
            label="Metrikk"
            value={metric}
            onChange={(value) => setMetric(value as MetricType)}
            data={[
              { value: 'loss_count', label: 'Totale tap' },
              { value: 'mortality_count', label: 'Dødelighet' },
              { value: 'culling_count', label: 'Slakting' }
            ]}
            w={150}
          />
          
          <Select
            label="Enhet"
            value={weightType}
            onChange={(value) => setWeightType(value as WeightType)}
            data={[
              { value: 'count', label: 'Antall' },
              { value: 'weight', label: 'Vekt (kg)' }
            ]}
            w={120}
          />

          <NumberInput
            label="Min. terskel"
            value={minThreshold}
            onChange={(value) => setMinThreshold(Number(value))}
            min={0}
            w={120}
          />

          <Switch
            label="Vis prosenter"
            checked={showPercentages}
            onChange={(event) => setShowPercentages(event.currentTarget.checked)}
          />
        </Group>

        {/* Chart */}
        <div style={{ height: '600px', width: '100%' }}>
          <SankeyChart
            data={sankeyData}
            layout="none"
            orient="horizontal"
            nodeAlign="justify"
            nodeGap={20}
            nodeWidth={28}
            iterations={100}
            // Enhanced styling
            linkStyle={{
              fillOpacity: 0.6,
              strokeOpacity: 0.8,
              strokeWidth: 1
            }}
            nodeStyle={{
              stroke: '#333',
              strokeWidth: 1,
              fillOpacity: 0.9
            }}
          />
        </div>

        {/* Enhanced legend and statistics */}
        <Stack gap="xs">
          <Group gap="lg">
            <Text size="sm" c="dimmed">
              <b>Datakilde:</b> {showFarmerData ? 'Oppdretterrapporterte data' : 'Aggregerte data'}
            </Text>
            <Text size="sm" c="dimmed">
              <b>Tidsperiode:</b> {data.length > 0 ? data[0].period : 'N/A'}
            </Text>
            <Text size="sm" c="dimmed">
              <b>Viser:</b> Topp {topN} kategorier
            </Text>
          </Group>
          
          <Text size="xs" c="dimmed">
            Flytdiagrammet viser fordelingen av {getMetricLabel().toLowerCase()} fra hovedkategorier til 
            underkategorier. Bredden på linjene representerer den relative størrelsen på hver kategori. 
            Kategorier under {minThreshold.toLocaleString()} {weightType === 'weight' ? 'kg' : 'enheter'} er 
            ekskludert for klarhet.
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
}