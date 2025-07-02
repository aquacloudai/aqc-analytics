import {
    Title,
    Paper,
    Text,
    Loader,
    Alert,
    Group,
    Stack,
    Button,
    Select,
    Switch,
    Grid,
    ActionIcon,
    Tooltip,
    Badge
} from '@mantine/core';
import { useState, useMemo } from 'react';
import {
    IconAlertCircle,
    IconDownload,
    IconRefresh,
    IconSettings,
    IconX
} from '@tabler/icons-react';
import type { MortalityCategoryRate } from '../types/loss_mortality_category_rate';
import { MortalityCategoryRateTable } from '../components/tables/LossMortalityCategoryRateTable';
import { MortalityCategoryPieChart } from '../components/charts/MortalityCategoryPieChart';
import { useMortalityCategoryRates } from '../hooks/useLossByCategory';
import { downloadChartData } from '../utils/downloadCSV';
import { MortalitySankeyChart } from '../components/charts/MortalityCategorySankeyChart';
import { MortalityCategoryBarChart } from '../components/charts/MortalityCategoryBarChart';

import { generateChartData } from '../utils/LossMortalityChartData';




// Metric options for different views
const METRIC_OPTIONS = [
    { value: 'loss_rate', label: 'Tap rate (%)' },
    { value: 'mortality_rate', label: 'Dødelighet rate (%)' },
    { value: 'culling_rate', label: 'Utkasting rate (%)' },
    { value: 'loss_count', label: 'Tap antall' },
    { value: 'mortality_count', label: 'Dødelighet antall' },
    { value: 'culling_count', label: 'Utkasting antall' }
];

// Chart type options
const CHART_TYPE_OPTIONS = [
    { value: 'stacked', label: 'Stablet søylediagram' },
    { value: 'grouped', label: 'Grupperte søyler' }
];

// Grouping options
const GROUPING_OPTIONS = [
    { value: 'level1', label: 'Hovedkategori (Level 1)' },
    { value: 'code', label: 'Kategori kode' },
    { value: 'category', label: 'Kategori navn' }
];


export function Trends() {

    const { data: mortalityCategories, loading, error, refetch: fetchData } = useMortalityCategoryRates();

    // Chart configuration state
    const [selectedMetric, setSelectedMetric] = useState<keyof MortalityCategoryRate>('loss_rate');
    const [chartType, setChartType] = useState<'stacked' | 'grouped'>('stacked');
    const [grouping, setGrouping] = useState<'level1' | 'code' | 'category'>('level1');
    const [showHorizontal, setShowHorizontal] = useState(false);
    const [showValues, setShowValues] = useState(false);
    const [showAsPercentage, setShowAsPercentage] = useState(false);


    // New state for category filtering
    const [selectedLevel1Category, setSelectedLevel1Category] = useState<string | null>(null);

    // Get available Level 1 categories for the selector
    const level1Categories = useMemo(() => {
        if (!mortalityCategories.length) return [];

        const uniqueCategories = new Map<string, string>(); // key: level_1_name, value: label

        for (const item of mortalityCategories) {
            if (item.category_level_1_name && item.category_label) {
                uniqueCategories.set(item.category_level_1_name, item.category_label);
            }
        }

        return Array.from(uniqueCategories.entries())
            .sort((a, b) => a[1].localeCompare(b[1])) // sort by label
            .map(([value, label]) => ({ value, label }));
    }, [mortalityCategories]);


    // Filter data based on selected Level 1 category
    const filteredMortalityCategories = useMemo(() => {
        if (!selectedLevel1Category) {
            return mortalityCategories;
        }

        return mortalityCategories.filter(item =>
            item.category_level_1_name === selectedLevel1Category
        );
    }, [mortalityCategories, selectedLevel1Category]);

    const chartData = useMemo(() => {
        // Group by subcategory code if Level 1 selected, otherwise by chosen grouping
        const chartGrouping = selectedLevel1Category ? 'code' : grouping;
        return generateChartData(
            filteredMortalityCategories,
            chartGrouping,
            selectedMetric as keyof MortalityCategoryRate,
            showAsPercentage
        );
    }, [
        filteredMortalityCategories,
        grouping,
        selectedLevel1Category,
        selectedMetric,
        showAsPercentage
    ]);


    // Updated summary statistics to reflect percentage distribution
    const summaryStats = useMemo(() => {
        if (!filteredMortalityCategories.length) return null;

        const totalLoss = filteredMortalityCategories.reduce((sum, item) => sum + item.loss_count, 0);
        const totalMortality = filteredMortalityCategories.reduce((sum, item) => sum + item.mortality_count, 0);
        const totalCulling = filteredMortalityCategories.reduce((sum, item) => sum + item.culling_count, 0);

        // Calculate weighted average rates
        const totalFishForLoss = totalLoss > 0 ? totalLoss : 1;
        const weightedLossRate = filteredMortalityCategories.reduce((sum, item) =>
            sum + (item.loss_rate * item.loss_count), 0) / totalFishForLoss;

        const totalFishForMortality = totalMortality > 0 ? totalMortality : 1;
        const weightedMortalityRate = filteredMortalityCategories.reduce((sum, item) =>
            sum + (item.mortality_rate * item.mortality_count), 0) / totalFishForMortality;

        return {
            totalLoss,
            totalMortality,
            totalCulling,
            avgLossRate: weightedLossRate.toFixed(2),
            avgMortalityRate: weightedMortalityRate.toFixed(2),
            totalCategories: new Set(filteredMortalityCategories.map(item => item.loss_category_code)).size,
            totalPeriods: new Set(filteredMortalityCategories.map(item => item.period)).size,
            totalDataPoints: filteredMortalityCategories.length,
            distributionNote: 'Alle verdier vises som prosentandel av total per periode'
        };
    }, [filteredMortalityCategories]);


    if (loading) {
        return (
            <Stack align="center" mt="xl">
                <Loader size="lg" />
                <Text>Laster dødelighets trender...</Text>
            </Stack>
        );
    }

    if (error) {
        return (
            <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="Feil"
                color="red"
                mt="lg"
            >
                {error}
                <Button
                    variant="light"
                    size="xs"
                    onClick={fetchData}
                    leftSection={<IconRefresh size="1rem" />}
                    mt="md"
                >
                    Prøv igjen
                </Button>
            </Alert>
        );
    }


    const clearCategoryFilter = () => {
        console.log('Clearing category filter...');
        setShowAsPercentage(false);
        setSelectedLevel1Category(null);
        setGrouping('level1'); // Reset to default grouping
        console.log('Category filter cleared');
    };

    const selectedMetricLabel = METRIC_OPTIONS.find(opt => opt.value === selectedMetric)?.label || selectedMetric;

    return (
        <div>
            <Group justify="space-between" align="flex-end" mb="lg">
                <Title order={1}>
                    Dødelighets Trender
                    {summaryStats && (
                        <Text size="sm" c="dimmed" component="span" ml="sm">
                            ({summaryStats.totalPeriods} perioder, {summaryStats.totalCategories} kategorier, {summaryStats.totalDataPoints} datapunkter)
                        </Text>
                    )}
                </Title>

                <Group>
                    <Tooltip label="Oppdater data">
                        <ActionIcon variant="light" onClick={fetchData} loading={loading}>
                            <IconRefresh size="1rem" />
                        </ActionIcon>
                    </Tooltip>

                    {mortalityCategories.length > 0 && (
                        <Button
                            leftSection={<IconDownload size="1rem" />}
                            variant="light"
                            onClick={() => downloadChartData(filteredMortalityCategories)}
                        >
                            Last ned CSV
                        </Button>
                    )}
                </Group>
            </Group>



            <Paper shadow="sm" p="md" mb="lg">
                <Group justify="space-between" align="center" mb="md">
                    <Group>
                        <IconSettings size="1rem" />
                        <Text fw={600}>Diagram Innstillinger</Text>
                    </Group>

                    <Group>
                        <Tooltip label="Vis verdier på søyler">
                            <Switch
                                label="Vis verdier"
                                checked={showValues}
                                onChange={(e) => setShowValues(e.currentTarget.checked)}
                                size="sm"
                            />
                        </Tooltip>

                        <Tooltip label="Horisontalt diagram">
                            <Switch
                                label="Horisontal"
                                checked={showHorizontal}
                                onChange={(e) => setShowHorizontal(e.currentTarget.checked)}
                                size="sm"
                            />
                        </Tooltip>

                        {selectedLevel1Category && (
                            <Tooltip label="Vis som prosent av total per måned">
                                <Switch
                                    label="Vis som %"
                                    checked={showAsPercentage}
                                    onChange={(e) => setShowAsPercentage(e.currentTarget.checked)}
                                    size="sm"
                                    color="blue"
                                />
                            </Tooltip>
                        )}
                    </Group>

                    <Text size="lg" fw={600} mb="md">
                        {selectedMetricLabel} – {selectedLevel1Category ? 'Subkategori distribusjon' : 'Trend over tid'}
                        {selectedLevel1Category && showAsPercentage && ' (%)'}
                        {selectedLevel1Category && (
                            <Badge variant="light" color="blue" ml="sm" size="sm">
                                {selectedLevel1Category}
                            </Badge>
                        )}
                    </Text>
                </Group>
                <Grid>

                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Tooltip label="Filtrer data etter overordnet dødelighetskategori (Level 1)" withArrow>
                            <Select
                                label="Level 1 Kategori"
                                placeholder="Velg kategori (alle hvis tom)"
                                value={selectedLevel1Category}
                                onChange={(value) => {
                                    if (value === null) {
                                        // When clearing, use the clearCategoryFilter function
                                        clearCategoryFilter();
                                    } else {
                                        // When selecting, just set the category
                                        setSelectedLevel1Category(value);
                                    }
                                }}
                                data={level1Categories}
                                clearable
                                searchable
                                rightSection={selectedLevel1Category ? (
                                    <ActionIcon
                                        size="sm"
                                        variant="subtle"
                                        color="gray"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearCategoryFilter();
                                        }}
                                    >
                                        <IconX size="0.8rem" />
                                    </ActionIcon>
                                ) : undefined}
                            />
                        </Tooltip>
                    </Grid.Col>



                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                            label="Måling"
                            value={selectedMetric}
                            onChange={(value) => value && setSelectedMetric(value as keyof MortalityCategoryRate)}
                            data={METRIC_OPTIONS}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                            label="Gruppering"
                            value={grouping}
                            onChange={(value) => value && setGrouping(value as 'level1' | 'code' | 'category')}
                            data={GROUPING_OPTIONS}
                            disabled={!!selectedLevel1Category}
                            description={selectedLevel1Category ? "Automatisk satt til subkategorier når Level 1 er valgt" : undefined}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                            label="Diagram type"
                            value={chartType}
                            onChange={(value) => value && setChartType(value as 'stacked' | 'grouped')}
                            data={CHART_TYPE_OPTIONS}
                        />
                    </Grid.Col>

                    {selectedLevel1Category && (
                        <Grid.Col span={12}>
                            <Stack gap="xs">
                                <Text size="sm" fw={500}>Subkategori distribusjon</Text>
                                <Text size="xs" c="dimmed">
                                    Viser subkategorier (loss_category_code) innenfor "{selectedLevel1Category}".
                                    {summaryStats && ` ${summaryStats.totalDataPoints} datapunkter funnet med ${summaryStats.totalCategories} unike subkategorier.`}
                                </Text>
                            </Stack>
                        </Grid.Col>
                    )}
                </Grid>
            </Paper>

            {chartData && (
                <Grid gutter="md" grow>
                    <Grid.Col span={{ base: 12, md: 6 }}>

                        <MortalityCategoryBarChart
                            chartData={chartData}
                            selectedMetricLabel={selectedMetricLabel}
                            selectedLevel1Category={selectedLevel1Category}
                            showValues={showValues}
                            showHorizontal={showHorizontal}
                            dataPointCount={filteredMortalityCategories.length}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <MortalityCategoryPieChart
                            data={filteredMortalityCategories}
                            selectedMetric={selectedMetric as keyof MortalityCategoryRate}
                            metricLabel={selectedMetricLabel}
                            grouping={selectedLevel1Category ? 'code' : (grouping as 'level1' | 'code' | 'category')}
                        />

                    </Grid.Col>
                </Grid>
            )}

            <Paper shadow="sm" p="md" mt="xl">

                <MortalityCategoryRateTable
                    mortalityCategoryRates={filteredMortalityCategories}
                />


            </Paper>

            <Paper shadow="sm" p="md" mt="xl">
                <Text size="lg" fw={600} mb="md">
                    {selectedLevel1Category ? 'Subkategorier' : 'Dødelighets Kategorier'}
                    {selectedLevel1Category && (
                        <Badge variant="light" color="blue" ml="sm">
                            {selectedLevel1Category}
                        </Badge>
                    )}
                </Text>

                <Text size="sm" c="dimmed" mb="md">
                    {selectedLevel1Category
                        ? `Detaljerte data for alle subkategorier (loss_category_code) innenfor "${selectedLevel1Category}".`
                        : 'Denne tabellen viser detaljerte dødelighetsdata per kategori.'
                    }
                </Text>

                <MortalitySankeyChart data={filteredMortalityCategories} showFarmerData={false} />
            </Paper>
        </div>
    );
}