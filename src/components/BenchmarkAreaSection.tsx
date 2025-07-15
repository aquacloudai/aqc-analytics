import {
  Title,
  Group,
  Tooltip,
  ActionIcon,
  Button,
  Card,
  Flex,
  MultiSelect,
  SegmentedControl,
  Paper,
  Stack,
  Loader,
  Alert,
  Text,
} from '@mantine/core';
import { IconRefresh, IconDownload, IconAlertCircle } from '@tabler/icons-react';
import { useState, useMemo, useEffect } from 'react';
import { LineChart } from 'aqc-charts';
import type { LossMortalityByAreaAndMonthRecord } from '../types/loss_mortality_by_area_and_month';

const areaSourceOptions = [
  { label: "Aquacloud", value: "aquacloud" },
  { label: "Farmer", value: "farmer" },
  { label: "Fiskeridirektoratet", value: "fdir" },
];

const areaMetricFieldMap = {
  loss: {
    aquacloud: "cumulative_loss_rate_12_months",
    farmer: "farmer_cumulative_loss_rate_12_months",
    fdir: "fdir_cumulative_loss_rate_12_months",
  },
  mortality: {
    aquacloud: "cumulative_mortality_rate_12_months",
    farmer: "farmer_cumulative_mortality_rate_12_months",
    fdir: "fdir_cumulative_mortality_rate_12_months",
  },
  culling: {
    aquacloud: "cumulative_culling_rate_12_months",
    farmer: "farmer_cumulative_culling_rate_12_months",
    fdir: "fdir_cumulative_culling_rate_12_months",
  },
};

const areaMetricOptions = [
  { label: 'Tap', value: 'loss' },
  { label: 'Dødelighet', value: 'mortality' },
  { label: 'Utslakting', value: 'culling' },
];

type Props = {
  areaData: LossMortalityByAreaAndMonthRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function BenchmarkAreaSection({
  areaData,
  loading,
  error,
  refetch,
}: Props) {
  const areaList = useMemo(() => {
    if (!areaData) return [];
    return Array.from(new Set(areaData.map(d => d.aquacloud_area_name))).sort();
  }, [areaData]);

  // All combinations for selection
  const selectableAreaSources = useMemo(() => {
    return areaList.flatMap(area =>
      areaSourceOptions.map(source => ({
        value: `${area}__${source.value}`,
        label: `${area} (${source.label})`,
        area,
        source: source.value,
      }))
    );
  }, [areaList]);

  const [selectedAreaSources, setSelectedAreaSources] = useState<string[]>([]);
  const [areaMetric, setAreaMetric] = useState<'loss' | 'mortality' | 'culling'>('loss');

  useEffect(() => {
    if (selectedAreaSources.length === 0 && selectableAreaSources.length > 0) {
      setSelectedAreaSources([selectableAreaSources[0].value]);
    }
  }, [selectableAreaSources, selectedAreaSources.length]);

  // X-Axis: Month categories
  const areaCategories = useMemo(() => {
    if (!areaData.length) return [];
    return Array.from(new Set(areaData.map(d => d.month))).sort();
  }, [areaData]);

  // Chart series
  const areaChartSeries = useMemo(() => {
    return selectedAreaSources.map(sel => {
      const [area, source] = sel.split('__');
      const label = `${area} (${areaSourceOptions.find(s => s.value === source)?.label ?? source})`;
      const field = areaMetricFieldMap[areaMetric][source as keyof typeof areaMetricFieldMap['loss']];
      const records = areaData.filter(d => d.aquacloud_area_name === area);
      const data = areaCategories.map(month => {
        const rec = records.find(r => r.month === month);
        return rec && rec[field as keyof LossMortalityByAreaAndMonthRecord]
          ? +(Number(rec[field as keyof LossMortalityByAreaAndMonthRecord]) * 100).toFixed(2)
          : 0;
      });
      return { name: label, type: "line", data };
    });
  }, [selectedAreaSources, areaCategories, areaMetric, areaData]);

  // Optionally: CSV logic could be passed as a prop or implemented here

  return (
    <>
      <Group justify="space-between" align="flex-end">
        <Title order={2}>Benchmark: Områder</Title>
        <Group>
          <Tooltip label="Oppdater data">
            <ActionIcon variant="light" onClick={refetch} loading={loading}>
              <IconRefresh size="1rem" />
            </ActionIcon>
          </Tooltip>
          <Button
            leftSection={<IconDownload size="1rem" />}
            variant="light"
            onClick={() => {/* CSV logic here */}}
            disabled={!areaData.length}
          >
            Last ned CSV
          </Button>
        </Group>
      </Group>
      <Card shadow="sm" p="md">
        <Flex gap="md" align="center" wrap="wrap">
          <MultiSelect
            label="Områder"
            placeholder="Velg områder og kilde"
            data={selectableAreaSources}
            value={selectedAreaSources}
            onChange={setSelectedAreaSources}
            w={400}
            searchable
            clearable
          />
          <div>
            <Text size="sm" mb={4}>Kategori</Text>
          <SegmentedControl
            value={areaMetric}
            onChange={(value) => setAreaMetric(value as 'loss' | 'mortality' | 'culling')}
            data={areaMetricOptions}
          />
            </div>
        </Flex>
      </Card>
      <Paper shadow="sm" p="md">
        <Text size="lg" fw={600} mb="md">
          {areaMetricOptions.find(o => o.value === areaMetric)?.label}
        </Text>
        {loading ? (
          <Stack align="center" mt="xl">
            <Loader size="lg" />
            <Text>Laster områdedata...</Text>
          </Stack>
        ) : error ? (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Feil" color="red" mt="lg">
            {error}
            <Button
              variant="light"
              size="xs"
              onClick={refetch}
              leftSection={<IconRefresh size="1rem" />}
              mt="md"
            >
              Prøv igjen
            </Button>
          </Alert>
        ) : (
          <LineChart
            title={`${areaMetricOptions.find(o => o.value === areaMetric)?.label || ''} per område og kilde`}
            data={{
              categories: areaCategories,
              series: areaChartSeries,
            }}
            unit="%"
            height={400}
            xAxisTitle="Kalendermåned"
            yAxisTitle={areaMetricOptions.find(o => o.value === areaMetric)?.label || ''}
          />
        )}
      </Paper>
    </>
  );
}
