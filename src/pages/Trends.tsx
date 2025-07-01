import {
    Title,
    Paper,
    Text,
    Loader,
    Alert,
    ScrollArea,
    Group,
    Stack,
    Button,
    Select,
    Switch,
    Card,
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
    IconFilter,
    IconX
} from '@tabler/icons-react';
import type { MortalityCategoryRate } from '../types/loss_mortality_category_rate';
import { StackedBarChart } from 'aqc-charts';
import { MortalityCategoryRateTable } from '../components/tables/LossMortalityCategoryRateTable';
import { MortalityCategoryPieChart } from '../components/charts/MortalityCategoryPieChart';
import { useMortalityCategoryRates } from '../hooks/useLossByCategory';
import { formatPeriod, downloadChartData } from '../utils/downloadCSV';
import { MortalitySankeyChart } from '../components/charts/MortalityCategorySankeyChart';


const CHART_COLORS = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666',
    '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
    '#ea7ccc', '#2fc25b', '#ffc658', '#8884d8'
];

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
    const [selectedMetric, setSelectedMetric] = useState<string>('loss_rate');
    const [chartType, setChartType] = useState<string>('stacked');
    const [grouping, setGrouping] = useState<string>('level1');
    const [showHorizontal, setShowHorizontal] = useState(false);
    const [showValues, setShowValues] = useState(false);
    const [showAsPercentage, setShowAsPercentage] = useState(false);


    // New state for category filtering
    const [selectedLevel1Category, setSelectedLevel1Category] = useState<string | null>(null);

    // Get available Level 1 categories for the selector
    const level1Categories = useMemo(() => {
        if (!mortalityCategories.length) return [];

        const categories = [...new Set(mortalityCategories.map(item => item.category_level_1_name))]
            .filter(Boolean)
            .sort();

        return categories.map(cat => ({ value: cat, label: cat }));
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
        if (!filteredMortalityCategories.length) return null;

        // Debug logs
        console.log('=== Chart Data Debug ===');
        console.log('selectedLevel1Category:', selectedLevel1Category);
        console.log('grouping:', grouping);
        console.log('filteredMortalityCategories length:', filteredMortalityCategories.length);

        const periods = [...new Set(filteredMortalityCategories.map(item => item.period))].sort();

        let groups: string[] = [];
        let getGroupKey: (item: MortalityCategoryRate) => string;
        let getGroupName: (item: MortalityCategoryRate) => string;

        // When a Level 1 category is selected, automatically show subcategories
        if (selectedLevel1Category) {
            console.log('Branch: Level 1 category selected - showing subcategories');
            groups = [...new Set(filteredMortalityCategories.map(item => item.loss_category_code))];
            getGroupKey = (item) => item.loss_category_code;
            getGroupName = (item) => `${item.loss_category_code} - ${item.category_short_name}`;
        } else {
            console.log('Branch: No Level 1 category - using grouping:', grouping);
            // Default behavior when no Level 1 category is selected
            switch (grouping) {
                case 'level1':
                    console.log('Using level1 grouping');
                    groups = [...new Set(filteredMortalityCategories.map(item => item.category_level_1_name))];
                    getGroupKey = (item) => item.category_level_1_name;
                    getGroupName = (item) => item.category_level_1_name;
                    break;
                case 'code':
                    console.log('Using code grouping');
                    groups = [...new Set(filteredMortalityCategories.map(item => item.loss_category_code))];
                    getGroupKey = (item) => item.loss_category_code;
                    getGroupName = (item) => `${item.loss_category_code} - ${item.category_short_name}`;
                    break;
                case 'category':
                    console.log('Using category grouping');
                    groups = [...new Set(filteredMortalityCategories.map(item => item.category_short_name))];
                    getGroupKey = (item) => item.category_short_name;
                    getGroupName = (item) => item.category_short_name;
                    break;
                default:
                    console.log('Using default (level1) grouping');
                    groups = [...new Set(filteredMortalityCategories.map(item => item.category_level_1_name))];
                    getGroupKey = (item) => item.category_level_1_name;
                    getGroupName = (item) => item.category_level_1_name;
            }
        }

        console.log('Final groups:', groups);
        console.log('=== End Chart Data Debug ===');

        const periodTotals: Record<string, number> = {};

        periods.forEach(period => {
            const itemsForPeriod = filteredMortalityCategories.filter(item => item.period === period);
            const total = itemsForPeriod.reduce((sum, item) => {
                const value = item[selectedMetric as keyof MortalityCategoryRate] as number;
                return sum + (value ?? 0);
            }, 0);
            periodTotals[period] = total;
        });

        // Step 1: Prepare base data per group per period
        const rawGroupData: Record<string, number[]> = {};

        groups.forEach(group => {
            const data = periods.map(period => {
                const relevantItems = filteredMortalityCategories.filter(item =>
                    item.period === period && getGroupKey(item) === group
                );
                return relevantItems.reduce((sum, entry) => {
                    const value = entry[selectedMetric as keyof MortalityCategoryRate] as number;
                    return sum + (value ?? 0);
                }, 0);
            });
            rawGroupData[group] = data;
        });

        // Step 2: Calculate total per period (already done in periodTotals)

        // Step 3: Determine which groups to keep vs group as "Annet"
        const otherGroupData = new Array(periods.length).fill(0);
        const finalSeries = [];
        const threshold = 0.3;

        Object.entries(rawGroupData).forEach(([group, values], index) => {
            const isBelowThreshold = values.every((value, i) => {
                const total = periodTotals[periods[i]];
                const percent = total > 0 ? (value / total) * 100 : 0;
                return percent < threshold;
            });

            if (isBelowThreshold) {
                values.forEach((v, i) => otherGroupData[i] += v);
            } else {
                const sampleItem = filteredMortalityCategories.find(item => getGroupKey(item) === group);
                finalSeries.push({
                    name: sampleItem ? getGroupName(sampleItem) : group,
                    data: showAsPercentage
                        ? values.map((v, i) =>
                            periodTotals[periods[i]] > 0
                                ? Number(((v / periodTotals[periods[i]]) * 100).toFixed(2))
                                : 0
                        )
                        : values,
                    color: CHART_COLORS[finalSeries.length % CHART_COLORS.length],
                });
            }
        });

        // Step 4: Add 'Annet' if applicable
        if (otherGroupData.some(v => v > 0)) {
            finalSeries.push({
                name: 'Annet',
                data: showAsPercentage
                    ? otherGroupData.map((v, i) =>
                        periodTotals[periods[i]] > 0
                            ? Number(((v / periodTotals[periods[i]]) * 100).toFixed(2))
                            : 0
                    )
                    : otherGroupData,
                color: '#cccccc',
            });
        }

        return {
            categories: periods.map(formatPeriod),
            series: finalSeries,
            metadata: {
                periodTotals,
                isFiltered: !!selectedLevel1Category,
                filterCategory: selectedLevel1Category,
                showAsPercentage,
            },
        };
    }, [filteredMortalityCategories, selectedMetric, grouping, selectedLevel1Category, showAsPercentage]);




    // Calculate summary statistics (now uses filtered data)
    const summaryStats = useMemo(() => {
        if (!filteredMortalityCategories.length) return null;

        const totalLoss = filteredMortalityCategories.reduce((sum, item) => sum + item.loss_count, 0);
        const totalMortality = filteredMortalityCategories.reduce((sum, item) => sum + item.mortality_count, 0);
        const totalCulling = filteredMortalityCategories.reduce((sum, item) => sum + item.culling_count, 0);
        const avgLossRate = filteredMortalityCategories.reduce((sum, item) => sum + item.loss_rate, 0) / filteredMortalityCategories.length;

        return {
            totalLoss,
            totalMortality,
            totalCulling,
            avgLossRate: avgLossRate.toFixed(2),
            totalCategories: new Set(filteredMortalityCategories.map(item => item.loss_category_code)).size,
            totalPeriods: new Set(filteredMortalityCategories.map(item => item.period)).size,
            totalDataPoints: filteredMortalityCategories.length
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
                            onChange={(value) => value && setSelectedMetric(value)}
                            data={METRIC_OPTIONS}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                            label="Gruppering"
                            value={grouping}
                            onChange={(value) => value && setGrouping(value)}
                            data={GROUPING_OPTIONS}
                            disabled={!!selectedLevel1Category}
                            description={selectedLevel1Category ? "Automatisk satt til subkategorier når Level 1 er valgt" : undefined}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                            label="Diagram type"
                            value={chartType}
                            onChange={(value) => value && setChartType(value)}
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
                        <Paper shadow="sm" p="md" h="100%">
                            <Text size="lg" fw={600} mb="md">
                                {selectedMetricLabel} – {selectedLevel1Category ? 'Subkategori distribusjon' : 'Trend over tid'}
                                {selectedLevel1Category && (
                                    <Badge variant="light" color="blue" ml="sm" size="sm">
                                        {selectedLevel1Category}
                                    </Badge>
                                )}
                            </Text>

                            <div style={{ height: '500px', width: '100%' }}>
                                <StackedBarChart
                                    data={chartData}
                                    title=""
                                    width="100%"
                                    height={500}
                                    legend={
                                        {
                                            type: 'scroll',
                                            orient: 'vertical',
                                            right: 20,
                                            top: 40,
                                            bottom: 20,
                                        }
                                    }
                                    horizontal={showHorizontal}
                                    showValues={showValues}
                                />
                            </div>

                            <Text size="xs" c="dimmed" mt="sm">
                                Basert på {filteredMortalityCategories.length} datapunkter.
                                {selectedLevel1Category && ` Viser subkategorier innenfor: ${selectedLevel1Category}.`}
                                Sist oppdatert: {new Date().toLocaleString('nb-NO')}
                            </Text>
                        </Paper>
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