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
    Badge,
    Divider,
    Card
} from '@mantine/core';
import { useState, useMemo } from 'react';
import {
    IconAlertCircle,
    IconDownload,
    IconRefresh,
    IconSettings,
    IconX,
    IconInfoCircle,
    IconChartBar,
    IconEye
} from '@tabler/icons-react';
import type { MortalityCategoryRate } from '../types/loss_mortality_category_rate';
import { MortalityCategoryRateTable } from '../components/tables/LossMortalityCategoryRateTable';
import { MortalityCategoryPieChart } from '../components/charts/MortalityCategoryPieChart';
import { useMortalityCategoryRates } from '../hooks/useLossByCategory';
import { downloadChartData } from '../utils/downloadCSV';
import { MortalitySankeyChart } from '../components/charts/MortalityCategorySankeyChart';
import { MortalityCategoryBarChart } from '../components/charts/MortalityCategoryBarChart';

import { generateChartData } from '../utils/LossMortalityChartData';
import { useFarmer } from '../hooks/useFarmer';
import { useAdminFarmerStore } from '../store/adminFarmerStore';
import { useAuthStore } from '../store/authStore';

const PERIOD_OPTIONS = [
    { value: 'month', label: 'Måned' },
    { value: 'quarterly', label: 'Kvartal' },
    { value: 'tertial', label: 'Tertial' },
    { value: 'year', label: 'År' }
];

const METRIC_OPTIONS = [
    { value: 'loss_rate', label: 'Tap rate (%)' },
    { value: 'mortality_rate', label: 'Dødelighet rate (%)' },
    { value: 'culling_rate', label: 'Utkasting rate (%)' },
    { value: 'loss_count', label: 'Tap antall' },
    { value: 'mortality_count', label: 'Dødelighet antall' },
    { value: 'culling_count', label: 'Utkasting antall' }
];

const CHART_TYPE_OPTIONS = [
    { value: 'stacked', label: 'Stablet søylediagram' },
    { value: 'grouped', label: 'Grupperte søyler' }
];

const GROUPING_OPTIONS = [
    { value: 'level1', label: 'Hovedkategori (Level 1)' },
    { value: 'code', label: 'Kategori kode' },
    { value: 'category', label: 'Kategori navn' }
];

export function Trends() {

    // Chart configuration state
    const [selectedMetric, setSelectedMetric] = useState<keyof MortalityCategoryRate>('loss_rate');
    const [chartType, setChartType] = useState<'stacked' | 'grouped'>('stacked');
    const [grouping, setGrouping] = useState<'level1' | 'code' | 'category'>('level1');
    const [showHorizontal, setShowHorizontal] = useState(false);
    const [showValues, setShowValues] = useState(false);
    const [showAsPercentage, setShowAsPercentage] = useState(false);

    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const { data: mortalityCategories, loading, error, refetch: fetchData } = useMortalityCategoryRates(selectedPeriod);

    const [selectedFarmerView, setSelectedFarmerView] = useState('aquacloud');

    const { user } = useAuthStore();
    const { data: farmer, loading: farmerLoading, error: farmerError } = useFarmer();
    const { selectedFarmer } = useAdminFarmerStore();
    const isAdmin = user?.roles.includes('aqc-admin');

    // New state for category filtering
    const [selectedLevel1Category, setSelectedLevel1Category] = useState<string | null>(null);

    const FARMER_OPTIONS = useMemo(() => {
        if (isAdmin) {
            return [
                { value: 'aquacloud', label: 'AquaCloud' },
                ...(selectedFarmer ? [{ value: selectedFarmer, label: selectedFarmer }] : [])
            ];
        } else if (farmer) {
            return [
                { value: 'aquacloud', label: 'AquaCloud' },
                { value: farmer.name, label: farmer.name }
            ];
        } else {
            return [{ value: 'aquacloud', label: 'AquaCloud' }];
        }
    }, [isAdmin, selectedFarmer, farmer]);


    // Get available Level 1 categories for the selector
    const level1Categories = useMemo(() => {
        if (!mortalityCategories.length) return [];

        const uniqueCategories = new Map<string, string>();

        for (const item of mortalityCategories) {
            if (item.category_level_1_name && item.category_label) {
                uniqueCategories.set(item.category_level_1_name, item.category_label);
            }
        }

        return Array.from(uniqueCategories.entries())
            .sort((a, b) => a[1].localeCompare(b[1]))
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

    interface MortalityViewData {
        loss_count: number;
        mortality_count: number;
        culling_count: number;
        loss_rate: number;
        mortality_rate: number;
        culling_rate: number;
        farmer_loss_count?: number | null;
        farmer_mortality_count?: number | null;
        farmer_culling_count?: number | null;
        farmer_loss_rate?: number | null;
        farmer_mortality_rate?: number | null;
        farmer_culling_rate?: number | null;
        [key: string]: any;
    }

    type MortalityView = 'aquacloud' | string;

    function mapMortalityView<T extends MortalityViewData>(data: T[], view: MortalityView): T[] {
        if (view === 'aquacloud') return data;
        return data.map(item => ({
            ...item,
            loss_count: item.farmer_loss_count ?? 0,
            mortality_count: item.farmer_mortality_count ?? 0,
            culling_count: item.farmer_culling_count ?? 0,
            loss_rate: item.farmer_loss_rate ?? 0,
            mortality_rate: item.farmer_mortality_rate ?? 0,
            culling_rate: item.farmer_culling_rate ?? 0,
        }));
    }


    const mappedMortalityCategories = useMemo(() => {
        return mapMortalityView(filteredMortalityCategories, selectedFarmerView) as MortalityCategoryRate[];
    }, [filteredMortalityCategories, selectedFarmerView]);

    const chartData = useMemo(() => {
        const chartGrouping = selectedLevel1Category ? 'code' : grouping;
        return generateChartData(
            mappedMortalityCategories,
            chartGrouping,
            selectedMetric as keyof MortalityCategoryRate,
            showAsPercentage
        );
    }, [
        mappedMortalityCategories,
        grouping,
        selectedLevel1Category,
        selectedMetric,
        showAsPercentage
    ]);



    const summaryStats = useMemo(() => {
        if (!filteredMortalityCategories.length) return null;

        const totalLoss = filteredMortalityCategories.reduce((sum, item) => sum + item.loss_count, 0);
        const totalMortality = filteredMortalityCategories.reduce((sum, item) => sum + item.mortality_count, 0);
        const totalCulling = filteredMortalityCategories.reduce((sum, item) => sum + item.culling_count, 0);

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
        setShowAsPercentage(false);
        setSelectedLevel1Category(null);
        setGrouping('level1');
    };

    const selectedMetricLabel = METRIC_OPTIONS.find(opt => opt.value === selectedMetric)?.label || selectedMetric;

    return (
        <Stack gap="lg">
            {/* Page Header */}
            <Group justify="space-between" align="flex-end">
                <Title order={1}>
                    Dødelighetstrender
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

            {/* Configuration Panel */}
            <Card shadow="sm" p="md">
                <Stack gap="md">
                    {/* Header Row */}
                    <Group justify="space-between" align="center">
                        <Group>
                            <IconSettings size="1.2rem" />
                            <Text size="lg" fw={600}>Diagram Innstillinger</Text>
                        </Group>

                        <Group gap="sm">
                            <Select
                                label="Periode"
                                value={selectedPeriod}
                                onChange={(value) => value && setSelectedPeriod(value)}
                                data={PERIOD_OPTIONS}
                                size="sm"
                                w={120}
                            />
                            <Select
                                label="Datavisning"
                                value={selectedFarmerView}
                                onChange={(value) => value && setSelectedFarmerView(value)}
                                data={FARMER_OPTIONS}
                                size="sm"
                                w={160}
                            />
                        </Group>
                    </Group>


                    {/* Configuration Grid */}
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Tooltip label="Filtrer data etter overordnet dødelighetskategori (Level 1)" withArrow>
                                <Select
                                    label="Level 1 Kategori"
                                    placeholder="Velg kategori (alle hvis tom)"
                                    value={selectedLevel1Category}
                                    onChange={(value) => {
                                        if (value === null) {
                                            clearCategoryFilter();
                                        } else {
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
                    </Grid>

                    {/* Display Options */}
                    <Group justify="space-between" align="flex-start">
                        <Group>
                            <IconEye size="1rem" />
                            <Text size="sm" fw={500}>Visningsalternativer:</Text>
                        </Group>
                        <Group gap="lg">
                            <Switch
                                label="Vis verdier"
                                description="Vis verdier på søyler"
                                checked={showValues}
                                onChange={(e) => setShowValues(e.currentTarget.checked)}
                                size="sm"
                            />
                            <Switch
                                label="Horisontal"
                                description="Horisontalt diagram"
                                checked={showHorizontal}
                                onChange={(e) => setShowHorizontal(e.currentTarget.checked)}
                                size="sm"
                            />
                            {selectedLevel1Category && (
                                <Switch
                                    label="Vis som %"
                                    description="Vis som prosent av total per måned"
                                    checked={showAsPercentage}
                                    onChange={(e) => setShowAsPercentage(e.currentTarget.checked)}
                                    size="sm"
                                    color="blue"
                                />
                            )}
                        </Group>
                    </Group>


                    {/* Conditional Info */}
                    {selectedLevel1Category && (
                        <Alert variant="light" color="blue" icon={<IconInfoCircle size="1rem" />}>
                            <Text size="sm">
                                <Text component="span" fw={500}>Subkategori distribusjon:</Text> Viser subkategorier (loss_category_code) innenfor "{selectedLevel1Category}".
                                {summaryStats && ` ${summaryStats.totalDataPoints} datapunkter funnet med ${summaryStats.totalCategories} unike subkategorier.`}
                            </Text>
                        </Alert>
                    )}
                </Stack>
            </Card>

            {/* Charts */}
            {chartData && (
                <Grid gutter="md">
                    <Grid.Col span={{ base: 12, lg: 6 }}>
                        <MortalityCategoryBarChart
                            chartData={chartData}
                            selectedMetricLabel={selectedMetricLabel}
                            selectedLevel1Category={selectedLevel1Category}
                            showValues={showValues}
                            showHorizontal={showHorizontal}
                            dataPointCount={mappedMortalityCategories.length}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, lg: 6 }}>
                        <MortalityCategoryPieChart
                            data={mappedMortalityCategories}
                            selectedMetric={selectedMetric as keyof MortalityCategoryRate}
                            metricLabel={selectedMetricLabel}
                            grouping={selectedLevel1Category ? 'code' : (grouping as 'level1' | 'code' | 'category')}
                        />
                    </Grid.Col>
                </Grid>
            )}

            {/* Data Table */}
            <Paper shadow="sm" p="md">
                <MortalityCategoryRateTable
                    mortalityCategoryRates={mappedMortalityCategories}
                />
            </Paper>

            {/* Sankey Chart */}
            <Paper shadow="sm" p="md">
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

 
            </Paper>
        </Stack>
    );
}