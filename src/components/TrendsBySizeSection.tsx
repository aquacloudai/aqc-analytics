import { useMemo, useState } from 'react';
import {
    Stack, Title, Text, Alert, Select, Loader, Box,
    Card, Switch, Group, Tooltip, ActionIcon
} from '@mantine/core';
import { IconInfoCircle, IconSettings, IconRefresh } from '@tabler/icons-react';
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
    const [showPercentage, setShowPercentage] = useState(true);
    const [showValues, setShowValues] = useState(false);
    const [showHorizontal, setShowHorizontal] = useState(false);

    const { data: rawData, loading, error, refetch } = useMortalityCategoryBySize(Number(bucket));

    const chartData = useMemo(() => {
        if (!rawData || rawData.length === 0) return { categories: [], series: [] };
        return generateSizeDistributionChartData(rawData);
    }, [rawData]);

    return (
        <Stack gap="lg">
            <Title order={2}>Årsak / størrelse</Title>
            <Alert color="blue" icon={<IconInfoCircle size="1rem" />}>
                Her vises dødelighet etter størrelse. Velg ønsket vektgruppe og se fordelingen per kategori under.
            </Alert>

            {/* Diagram Innstillinger Card */}
            <Card shadow="sm" p="md">
                <Group justify="space-between" align="center">
                    <Group>
                        <IconSettings size="1.2rem" />
                        <Text size="lg" fw={600}>Diagram Innstillinger</Text>
                    </Group>
                    <Group>
                        <Tooltip label="Oppdater data">
                            <ActionIcon variant="light" onClick={refetch} loading={loading}>
                                <IconRefresh size="1rem" />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
                <Group mt="md" gap="md" align="flex-end" wrap="wrap">
                    <Select
                        label="Vektgruppe"
                        value={bucket}
                        onChange={value => value && setBucket(value)}
                        data={bucketOptions}
                        maw={120}
                        size="sm"
                    />
                    <Switch
                        label="Vis som prosent"
                        checked={showPercentage}
                        onChange={e => setShowPercentage(e.currentTarget.checked)}
                        size="sm"
                    />
                    <Switch
                        label="Vis verdier"
                        checked={showValues}
                        onChange={e => setShowValues(e.currentTarget.checked)}
                        size="sm"
                    />
                    <Switch
                        label="Horisontal"
                        checked={showHorizontal}
                        onChange={e => setShowHorizontal(e.currentTarget.checked)}
                        size="sm"
                    />
                </Group>
            </Card>

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
                        showPercentage={showPercentage}
                        showValues={showValues}
                        horizontal={showHorizontal}
                    />
                </Box>
            )}
        </Stack>
    );
}
