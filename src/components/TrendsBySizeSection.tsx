import { Stack, Title, Text, Alert, Select, Loader, Box } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import { useMortalityCategoryBySize } from '../hooks/lossMortality/useLossCategoryBySize';
import { StackedBarChart } from 'aqc-charts';

const bucketOptions = [
  { value: '100', label: '100g' },
  { value: '200', label: '200g' },
  { value: '500', label: '500g' },
  { value: '1000', label: '1 kg' },
];

// Decide which rates to show as series:
const series = [
  { key: 'rate', label: 'Tap (%)' },
  { key: 'mortality_rate', label: 'Dødelighet (%)' },
  { key: 'culling_rate', label: 'Utkasting (%)' },
];

export function TrendsBySizeSection() {
  const [bucket, setBucket] = useState<string>('100');
  const { data, loading, error } = useMortalityCategoryBySize(Number(bucket));

 console.log('TrendsBySizeSection data:', data);
  


  return (
    <Stack gap="lg">
      <Title order={2}>Årsak / størrelse</Title>
      <Alert color="blue" icon={<IconInfoCircle size="1rem" />}>
        Her vises dødelighet etter størrelse. Velg ønsket vektgruppe og se fordelingen per kategori under.
      </Alert>

      <Select
        label="Vektgruppe"
        value={bucket}
        onChange={(value) => value && setBucket(value)}
        data={bucketOptions}
        maw={200}
      />

      {loading && (
        <Box><Loader size="sm" /></Box>
      )}

      {error && (
        <Alert color="red">{error}</Alert>
      )}

      {!loading && !error && (!data || data.length === 0) && (
        <Text size="sm" c="dimmed">
          Ingen data for valgt vektgruppe og filtere.
        </Text>
      )}

      {!loading && !error && data && data.length > 0 && (
        <Box>

        </Box>
      )}
    </Stack>
  );
}
