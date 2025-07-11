import {
  Paper,
  Text,
  Title,
  Group,
  Grid,
  Stack,
  Badge,
  Switch,
  Button,
  Loader
} from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import ReactECharts from 'echarts-for-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { LossByRegionRecord } from '../types/loss_by_region';

const formatPercent = (value: number | null | undefined) =>
  value != null ? `${(value * 100).toFixed(1)}%` : '–';

const MortalityCard = ({
  title,
  value,
  delta,
  isNegative = false,
  dateLabel,
}: {
  title: string;
  value: string;
  delta: string;
  isNegative?: boolean;
  dateLabel: string;
}) => (
  <Paper withBorder p="xs" radius="md">
    <Stack gap={4}>
      <Text size="xs" c="dimmed">
        {title}
      </Text>
      <Group gap={4}>
        <Text size="lg" fw={700}>
          {value}
        </Text>
        <Badge
          color={isNegative ? 'red' : 'green'}
          variant="light"
          size="sm"
          leftSection={isNegative ? <IconArrowUpRight size={12} /> : <IconArrowDownRight size={12} />}
        >
          {delta}
        </Badge>
      </Group>
      <Text size="xs" c="dimmed">
        {dateLabel}
      </Text>
    </Stack>
  </Paper>
);


type LossByRegionOverviewProps = {
  data: LossByRegionRecord[];
};

export const LossByRegionOverview = ({ data }: LossByRegionOverviewProps) => {
  const [includeCulling, setIncludeCulling] = useState(false);

  const getRegionData = (region: string) =>
    data.find((d) => d.production_region_name === region && d.is_last_month);

  const renderCards = (region: string, label: string) => {
    const entry = getRegionData(region);
    if (!entry) return null;

    const rate12 = includeCulling
      ? entry.cumulative_weighted_loss_rate_12_months
      : entry.cumulative_weighted_mortality_rate_12_months;

    const rateMonth = includeCulling
      ? entry.weighted_loss_rate
      : entry.weighted_mortality_rate;

    const trend = entry.relative_trend_12_months;

    function formatMonth(dateStr: string) {
      const date = new Date(dateStr);
      const label = date.toLocaleString('nb-NO', { month: 'long', year: 'numeric' });
      return label.charAt(0).toUpperCase() + label.slice(1);
    }


    return (
      <Group grow>
        <MortalityCard
          title={`Dødelighet ${label}`}
          value={formatPercent(rate12)}
          delta={formatPercent(Math.abs(trend))}
          isNegative={trend > 0}
          dateLabel="Akkumulert 12 mnd"
        />
        <MortalityCard
          title={`Dødelighet ${label}`}
          value={formatPercent(rateMonth)}
          delta={formatPercent(Math.abs(trend))}
          isNegative={trend > 0}
          dateLabel={entry.loss_rate_month ? formatMonth(entry.loss_rate_month) : ''}
        />

      </Group>
    );
  };


  const regions = ['Midt', 'Nord', 'Sør', 'Norge'];
  const months = Array.from(new Set(data.map((d) => d.loss_rate_month))).sort();
  const monthLabels = months.map((m) => m.slice(0, 7));

  const chartData = regions.map(region => ({
    name: region,
    type: 'line',
    data: months.map(month => {
      const entry = data.find(
        d => d.production_region_name === region && d.loss_rate_month === month
      );
      if (!entry) return null;
      return includeCulling
        ? entry.cumulative_weighted_loss_rate_12_months * 100
        : entry.cumulative_weighted_mortality_rate_12_months * 100;
    }),
  }));

  return (
    <Paper withBorder p="md" radius="md">
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          {data.length === 0 ? (
            <Loader size="sm" />
          ) : (
            <Stack gap="xs">
              {renderCards('Norge', 'Norge')}
              {renderCards('Sør', 'region Sør')}
              {renderCards('Midt', 'region Midt')}
              {renderCards('Nord', 'region Nord')}
              <Button
                component={Link}
                to="/fishhealth/trend"
                variant="default"
                mt="sm"
              >
                Klikk for mer om tap- og dødelighet
              </Button>
            </Stack>
          )}
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <ReactECharts
            style={{ height: 300 }}
            option={{
              backgroundColor: 'transparent',
              tooltip: { trigger: 'axis' },
              legend: { data: regions },
              xAxis: { type: 'category', data: monthLabels },
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: '{value}%',
                },
              },
              series: chartData,
            }}
          />

          <Group justify="space-between" mt="sm">
            <Text size="sm">Rullende 12 mnd akkumulert dødelighet</Text>
            <Group>
              <Text size="sm">Inkluder destruksjon/culling</Text>
              <Switch
                size="sm"
                checked={includeCulling}
                onChange={(e) => setIncludeCulling(e.currentTarget.checked)}
              />
            </Group>
          </Group>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
