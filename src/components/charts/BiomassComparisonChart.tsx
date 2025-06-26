import { Paper, Title } from '@mantine/core';
import ReactECharts from 'echarts-for-react';
import type { AquacloudFdirBiomassPerMonth } from '../../types/aquacloud_fdir_biomass_per_month';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  data: AquacloudFdirBiomassPerMonth[];
}

export function BiomassComparisonChart({ data }: Props) {
  const { colorScheme } = useTheme();

  return (
    <Paper p="md" radius="md" withBorder>
      <Title order={4} mb="md">Biomass development per month</Title>
      <ReactECharts
        option={{
          backgroundColor: 'transparent',
          grid: {
            left: 60,
            right: 30,
            top: 30,
            bottom: 80,
          },
          xAxis: {
            type: 'category',
            data: data.map(item => item.month),
            axisLine: {
              lineStyle: {
                color: colorScheme === 'dark' ? '#90d0d7' : '#495057',
              },
            },
            axisTick: {
              lineStyle: {
                color: colorScheme === 'dark' ? '#90d0d7' : '#495057',
              },
            },
            axisLabel: {
              color: colorScheme === 'dark' ? '#90d0d7' : '#495057',
              fontSize: 10,
              rotate: -45,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: colorScheme === 'dark' ? '#90d0d7' : '#495057',
              },
            },
            axisTick: {
              lineStyle: {
                color: colorScheme === 'dark' ? '#90d0d7' : '#495057',
              },
            },
            axisLabel: {
              color: colorScheme === 'dark' ? '#90d0d7' : '#495057',
              fontSize: 12,
            },
            splitLine: {
              lineStyle: {
                color: colorScheme === 'dark' ? '#90d0d7' : '#e9ecef',
                type: 'dashed',
              },
            },
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: colorScheme === 'dark' ? '#014059' : '#ffffff',
            borderColor: '#90d0d7',
            borderWidth: 1,
            textStyle: {
              color: colorScheme === 'dark' ? '#90d0d7' : '#495057',
            },
          },
          legend: {
            data: ['Fiskeridirektoratet', 'AquaCloud'],
            textStyle: {
              color: colorScheme === 'dark' ? '#90d0d7' : '#495057',
            },
          },
          series: [
            {
              name: 'Fiskeridirektoratet',
              type: 'bar',
              data: data.map(item => item.fiskeridirektoratet_biomass_in_tons ?? 0),
              itemStyle: { color: '#228be6' },
            },
            {
              name: 'AquaCloud',
              type: 'bar',
              data: data.map(item => item.aquacloud_biomass_in_tons ?? 0),
              itemStyle: { color: '#fab005' },
            },
          ],
        }}
        style={{ height: '400px', width: '100%' }}
      />
    </Paper>
  );
}
