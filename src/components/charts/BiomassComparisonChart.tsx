import {
  Paper,
  Title,
  Text,
  Loader,
  Group,
  Alert,
} from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useFilterStore } from '../../store/filterStore';
import { useBiomassComparisonData } from '../../hooks/useBiomassComparionData';
import { transformBiomassChartData, getBiomassChartOptions } from '../../utils/biomass';

export function BiomassComparisonChart() {
  const { colorScheme } = useTheme();
  const applyFilters = useFilterStore((s) => s.applyFilters);
  const fromMonthRaw = useFilterStore((s) => s.from_month);
  const toMonthRaw = useFilterStore((s) => s.to_month);
  const fromMonth = fromMonthRaw?.format('YYYY-MM');
  const toMonth = toMonthRaw?.format('YYYY-MM');

  const {
    data: biomassData,
    loading,
    error,
    refetch,
  } = useBiomassComparisonData(fromMonth, toMonth, [applyFilters]);

  const chartData = transformBiomassChartData(biomassData);
  const chartOption = getBiomassChartOptions(chartData, colorScheme === 'dark');

  if (loading) {
    return (
      <ChartCard>
        <Group justify="center" h={400}>
          <Loader size="lg" />
        </Group>
      </ChartCard>
    );
  }

  if (error) {
    return (
      <ChartCard>
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Feil"
          color="red"
          variant="light"
        >
          {error}
          <Group mt="sm">
            <IconRefresh size={16} style={{ cursor: 'pointer' }} onClick={refetch} />
            <Text size="sm" style={{ cursor: 'pointer' }} onClick={refetch}>
              Prøv igjen
            </Text>
          </Group>
        </Alert>
      </ChartCard>
    );
  }

  if (!biomassData?.length || !chartData) {
    return (
      <ChartCard>
        <Group justify="center" h={400}>
          <Text c="dimmed">Ingen data for valgt periode</Text>
        </Group>
      </ChartCard>
    );
  }

  return (
    <ChartCard>
      <ReactECharts
        option={chartOption}
        style={{ height: '450px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </ChartCard>
  );
}

// Reusable layout wrapper
function ChartCard({ children }: { children: React.ReactNode }) {
  return (
    <Paper p="md" radius="md" withBorder>
      <Title order={4} mb="md">Biomasseutvikling per måned</Title>
      {children}
    </Paper>
  );
}
