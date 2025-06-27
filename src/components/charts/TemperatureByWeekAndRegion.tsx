import { LineChart } from 'aqc-charts';
import { Box, Paper, Title } from '@mantine/core';
import { useTemperatureByWeekAndRegion } from '../../hooks/useTemperatureByWeekAndRegion';
import { useMemo } from 'react';

export function TemperatureLineChart() {
  const { data, isLoading, error } = useTemperatureByWeekAndRegion();

  type TemperatureDataItem = {
    production_region_name: string;
    measurement_week_date: string;
    avg_temperature: number;
  };

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const grouped = data.reduce(
      (acc: Record<string, { x: string; y: number }[]>, item: TemperatureDataItem) => {
        const region = item.production_region_name;
        if (!acc[region]) acc[region] = [];
        acc[region].push({
          x: item.measurement_week_date,
          y: item.avg_temperature,
        });
        return acc;
      },
      {}
    );

    const series = Object.entries(grouped).map(([region, points]) => ({
      name: region,
      type: 'line',
      data: (points as { x: string; y: number }[]).map(p => [p.x, p.y]), // echarts accepts [x, y]
      smooth: true,
      connectNulls: true,
    }));

    return series;
  }, [data]);

  if (isLoading || !chartData) return null;
  if (error) return <Box>Error loading temperature data</Box>;

  return (
    <Paper p="lg" radius="md" withBorder>
      <Title order={3}>Gjennomsnittstemperatur per uke</Title>
      <LineChart
        data={chartData}
        height={400}
        xAxis={{
          type: 'category',
          axisLabel: {
            rotate: 45,
          },
        }}
        yAxis={{
          type: 'value',
          name: '°C',
          axisLabel: {
            formatter: '{value}°C',
          },
        }}
        tooltip={{
          trigger: 'axis',
        }}
        legend={{ type: 'scroll' }}
      />
    </Paper>
  );
}
