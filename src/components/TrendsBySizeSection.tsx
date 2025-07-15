import { useMemo, useState } from 'react';
import { Stack, Title, Text, Alert, Select, Loader, Box } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { StackedBarChart } from 'aqc-charts';
import { useMortalityCategoryBySize } from '../hooks/lossMortality/useLossCategoryBySize';
import { generateSizeDistributionChartData } from '../utils/LossMortalityChartData';

const bucketOptions = [
    { value: '100', label: '100g' },
    { value: '200', label: '200g' },
    { value: '500', label: '500g' },
    { value: '1000', label: '1 kg' },
];

export function TrendsBySizeSection() {
    const [bucket, setBucket] = useState<string>('100');
    const { data: rawData, loading, error } = useMortalityCategoryBySize(Number(bucket));

    const chartData = useMemo(() => {
        if (!rawData || rawData.length === 0) return { categories: [], series: [] };
        return generateSizeDistributionChartData(rawData);
    }, [rawData]);


    // Build ECharts option for StackedBarChart
    const option = useMemo(() => {
        if (!chartData.categories.length || !chartData.series.length) return undefined;
        return {
            tooltip: { trigger: 'axis' },
            legend: { top: 10 },
            xAxis: { type: 'category', data: chartData.categories },
            yAxis: { type: 'value', name: 'Prosent (%)' },
            series: chartData.series.map(s => ({
                name: s.name,
                type: 'bar',
                stack: 'total',
                data: s.data,
                itemStyle: { color: s.color }
            })),
        };
    }, [chartData]);

    return (
        <Stack gap="lg">
            <Title order={2}>Årsak / størrelse</Title>
            <Alert color="blue" icon={<IconInfoCircle size="1rem" />}>
                Her vises dødelighet etter størrelse. Velg ønsket vektgruppe og se fordelingen per kategori under.
            </Alert>

            <Select
                label="Vektgruppe"
                value={bucket}
                onChange={value => value && setBucket(value)}
                data={bucketOptions}
                maw={200}
            />

            {loading && (
                <Box style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Loader size="sm" />
                </Box>
            )}

            {error && (
                <Alert color="red" title="Feil ved lasting av data">{String(error)}</Alert>
            )}

            {!loading && !error && chartData.categories.length === 0 && (
                <Alert color="yellow" icon={<IconInfoCircle size="1rem" />}>
                    <Text size="sm">
                        Ingen data tilgjengelig for valgt vektgruppe ({bucket}g).
                    </Text>
                </Alert>
            )}

            {!loading && !error && chartData.categories.length > 0 && (
                <Box>
                    <StackedBarChart
                        data={chartData}
                        height={400}
                        showPercentage={true}
                    />


                </Box>
            )}

        </Stack>
    );
}
