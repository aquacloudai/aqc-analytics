import { LineChart } from 'aqc-charts';
import { Box, Paper, Title } from '@mantine/core';
import { useTemperatureByWeekAndRegion } from '../../hooks/environment/useTemperatureByWeekAndRegion';
import { useMemo } from 'react';

export function TemperatureLineChart() {
  type TemperatureDataItem = {
    production_region_name: string;
    measurement_week_date: string;
    avg_temperature: number;
  };

  const { data, isLoading, error } = useTemperatureByWeekAndRegion() as {
    data: TemperatureDataItem[] | undefined;
    isLoading: boolean;
    error: unknown;
  };

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // 1. Sort dates and ensure uniqueness
    const allDates = Array.from(
      new Set(data.map((item) => item.measurement_week_date))
    ).sort();

    // 2. Group temperature values by region
    const grouped: Record<string, Record<string, number>> = {};
    for (const item of data) {
      if (!grouped[item.production_region_name]) {
        grouped[item.production_region_name] = {};
      }
      grouped[item.production_region_name][item.measurement_week_date] = item.avg_temperature;
    }

    // 3. Create series data with aligned x-axis values
    const series = Object.entries(grouped).map(([region, tempsByDate]) => ({
      name: region,
      data: allDates.map((date) => tempsByDate[date] ?? null), // insert null for missing values
    }));

    return {
      categories: allDates,
      series,
    };
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
          axisLabel: { rotate: 45 },
        }}
        yAxis={{
          type: 'value',
          name: '°C',
          axisLabel: { formatter: '{value}°C' },
        }}
        tooltip={{ trigger: 'axis' }}
        legend={{ type: 'scroll' }}
      />
    </Paper>
  );
}
