import { Paper, Text, Badge } from '@mantine/core';
import { StackedBarChart } from 'aqc-charts';
import type { MortalityCategoryRate } from '../../types/loss_mortality_category_rate';

type ChartSeries = {
    name: string;
    data: number[];
    color?: string;
};

type MortalityBarChartProps = {
    chartData: {
        categories: string[];
        series: ChartSeries[];
        metadata: {
            periodTotals: Record<string, number>;
            isFiltered: boolean;
            filterCategory: string | null;
            showAsPercentage: boolean;
            isRateMetric: boolean;
        };
    };
    selectedMetricLabel: string;
    selectedLevel1Category: string | null;
    showValues: boolean;
    showHorizontal: boolean;
    dataPointCount: number;
};

export function MortalityCategoryBarChart({
    chartData,
    selectedMetricLabel,
    selectedLevel1Category,
    showValues,
    showHorizontal,
    dataPointCount
}: MortalityBarChartProps) {
    // Detect if the current metric is a rate (percentage)
    const isRateMetric = chartData?.metadata?.isRateMetric ?? false;

    // For antall, calculate a dynamic max for yAxis
    const maxCount = isRateMetric
        ? 1
        : Math.ceil(
              Math.max(
                  ...chartData.series.flatMap(s => s.data)
              ) * 1.15 // add 15% headroom
          );

    // Y axis config
    const yAxisConfig = isRateMetric
        ? {
              max: 1,
              axisLabel: {
                  formatter: (val: number) => `${(val * 100).toFixed(0)}%`
              }
          }
        : {
              max: maxCount,
              axisLabel: {
                  formatter: (val: number) => val.toLocaleString('nb-NO')
              }
          };

    // Tooltip config
    const tooltipConfig = isRateMetric
        ? {
              trigger: 'axis',
              formatter: (params: Array<{ seriesName: string; value: number }>) =>
                  params
                      .map((p) => `${p.seriesName}: ${(p.value * 100).toFixed(2)}%`)
                      .join('<br/>')
          }
        : {
              trigger: 'axis',
              formatter: (params: Array<{ seriesName: string; value: number }>) =>
                  params
                      .map((p) => `${p.seriesName}: ${p.value.toLocaleString('nb-NO')}`)
                      .join('<br/>')
          };

    return (
        <Paper shadow="sm" p="md" h="100%">
            <Text size="lg" fw={600} mb="md">
                {selectedMetricLabel} – {selectedLevel1Category ? 'Subkategori distribusjon' : 'Trend over tid'}
                {selectedLevel1Category && (
                    <Badge variant="light" color="blue" ml="sm" size="sm">
                        {selectedLevel1Category}
                    </Badge>
                )}
            </Text>

            <div style={{ height: '500px', width: '100%' }}>
                <StackedBarChart
                    data={chartData}
                    height={500}
                    grid={{
                        top: 80,
                        bottom: 80,
                        left: 50,
                        right: 30
                    }}
                    yAxis={yAxisConfig}
                    tooltip={tooltipConfig}
                    legend={{
                        orient: 'horizontal',
                        bottom: 0,
                        textStyle: {
                            fontSize: 12
                        }
                    }}
                    showValues={showValues}
                    horizontal={showHorizontal}
                />
            </div>

            <Text size="xs" c="dimmed" mt="sm">
                Basert på {dataPointCount} datapunkter.
                {selectedLevel1Category && ` Viser subkategorier innenfor: ${selectedLevel1Category}.`}
                Sist oppdatert: {new Date().toLocaleString('nb-NO')}
            </Text>
        </Paper>
    );
}
