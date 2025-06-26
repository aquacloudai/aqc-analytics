import {
    Title,
    Paper,
    Tabs,
    Table,
    Text,
    Badge,
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
    Tooltip
} from '@mantine/core';
import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { isKeycloakReady } from '../config/keycloak';
import {
    IconAlertCircle,
    IconDownload,
    IconRefresh,
    IconChartBar,
    IconChartLine,
    IconSettings,
    IconInfoCircle
} from '@tabler/icons-react';
import type { MortalityCategoryRate } from '../types/loss_mortality_category_rate';
import { StackedBarChart, PieChart } from 'aqc-charts';
import { MortalityCategoryRateTable } from '../components/tables/LossMortalityCategoryRateTable';

import { useFilterStore } from '../store/filterStore';
import dayjs from 'dayjs';



// Enhanced color palette
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

// Helper function to format period display
const formatPeriod = (period: string): string => {
    const [year, month] = period.split('-');
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun',
        'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
};

// Helper function to download chart data as CSV
const downloadChartData = (data: MortalityCategoryRate[], filename: string = 'mortality_trends.csv') => {
    const headers = [
        'Periode',
        'Kategori kode',
        'Kategori navn',
        'Kategori kort navn',
        'Level 1 kategori',
        'Tap antall',
        'Dødelighet antall',
        'Utkasting antall',
        'Tap rate (%)',
        'Dødelighet rate (%)',
        'Utkasting rate (%)',
        'Gjennomsnittlig vekt tap (g)',
        'Gjennomsnittlig vekt død (g)',
        'Gjennomsnittlig vekt utkastet (g)'
    ];

    const csvRows = data.map(item => [
        formatPeriod(item.period),
        item.loss_category_code,
        item.category_name,
        item.category_short_name,
        item.category_level_1_name,
        item.loss_count.toString(),
        item.mortality_count.toString(),
        item.culling_count.toString(),
        item.loss_rate.toFixed(2),
        item.mortality_rate.toFixed(2),
        item.culling_rate.toFixed(2),
        item.loss_avg_weight_gram.toString(),
        item.mortality_avg_weight_gram.toString(),
        (item.culling_avg_weight_gram || 0).toString()
    ]);

    const csvContent = [headers, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};



export function Trends() {

    const applyFilters = useFilterStore((s) => s.applyFilters);

    const fromMonthRaw = useFilterStore((s) => s.from_month);
    const toMonthRaw = useFilterStore((s) => s.to_month);

    const fromMonth = fromMonthRaw ? fromMonthRaw.format('YYYY-MM') : undefined;
    const toMonth = toMonthRaw ? toMonthRaw.format('YYYY-MM') : undefined;

    const area = useFilterStore((s) => s.selectedArea);
    const generation = useFilterStore((s) => s.selectedGeneration);
    const weightRangeStart = useFilterStore((s) => s.weightRangeStart);
    const weightRangeEnd = useFilterStore((s) => s.weightRangeEnd);
    const includeSelf = useFilterStore((s) => s.include_self);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mortalityCategories, setMortalityCategories] = useState<MortalityCategoryRate[]>([]);

    // Chart configuration state
    const [selectedMetric, setSelectedMetric] = useState<string>('loss_rate');
    const [chartType, setChartType] = useState<string>('stacked');
    const [grouping, setGrouping] = useState<string>('level1');
    const [showHorizontal, setShowHorizontal] = useState(false);
    const [showValues, setShowValues] = useState(false);

    const fetchData = async () => {
        if (!isKeycloakReady()) return;
        setLoading(true);
        setError(null);

       try {
            const response = await api.get<{ data: MortalityCategoryRate[] }>(
                '/v3/loss-mortality/loss-mortality-category-rate',
                {
                    params: {
                        include_self: includeSelf,

                        ...(fromMonth && { from_month: `${fromMonth}-01` }),
                        ...(toMonth && { to_month: `${toMonth}-01` }),
                        area: area || '%',
                        generation: generation || undefined,
                        weight_range_start: weightRangeStart,
                        weight_range_end: weightRangeEnd,
                        period_grouping: 'month',
                        offset: 0,
                        limit: 10000,
                    }
                }
            );

            setMortalityCategories(response.data?.data || []);
        } catch (error) {
        console.error('[Trends] Failed to fetch mortality categories:', error);
        setError('Kunne ikke laste dødelighetskategorier. Vennligst prøv igjen.');
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [applyFilters]);
    

    // Memoized chart data processing
    const chartData = useMemo(() => {
        if (!mortalityCategories.length) return null;

        const periods = [...new Set(mortalityCategories.map(item => item.period))].sort();

        let groups: string[] = [];
        let getGroupKey: (item: MortalityCategoryRate) => string;
        let getGroupName: (item: MortalityCategoryRate) => string;

        switch (grouping) {
            case 'level1':
                groups = [...new Set(mortalityCategories.map(item => item.category_level_1_name))];
                getGroupKey = (item) => item.category_level_1_name;
                getGroupName = (item) => item.category_level_1_name;
                break;
            case 'code':
                groups = [...new Set(mortalityCategories.map(item => item.loss_category_code[0]))];
                getGroupKey = (item) => item.loss_category_code[0];
                getGroupName = (item) => `Kategori ${item.loss_category_code[0]}`;
                break;
            case 'category':
                groups = [...new Set(mortalityCategories.map(item => item.category_short_name))];
                getGroupKey = (item) => item.category_short_name;
                getGroupName = (item) => item.category_short_name;
                break;
            default:
                groups = [...new Set(mortalityCategories.map(item => item.category_level_1_name))];
                getGroupKey = (item) => item.category_level_1_name;
                getGroupName = (item) => item.category_level_1_name;
        }

        const series = groups.map((group, index) => {
            const data = periods.map(period => {
                const relevantItems = mortalityCategories.filter(item =>
                    item.period === period && getGroupKey(item) === group
                );

                const total = relevantItems.reduce((sum, entry) => {
                    const value = entry[selectedMetric as keyof MortalityCategoryRate] as number;
                    return sum + (value ?? 0);
                }, 0);

                return total;
            });

            const sampleItem = mortalityCategories.find(item => getGroupKey(item) === group);

            return {
                name: sampleItem ? getGroupName(sampleItem) : group,
                data,
                color: CHART_COLORS[index % CHART_COLORS.length],
            };
        });

        return {
            categories: periods.map(formatPeriod),
            series: series.filter(s => s.data.some(d => d > 0)), // Remove empty series
        };
    }, [mortalityCategories, selectedMetric, grouping]);

    const pieChartData = useMemo(() => {
        if (!mortalityCategories.length) return [];

        const grouped = new Map<string, number>();

        mortalityCategories.forEach(item => {
            let key: string;
            switch (grouping) {
                case 'level1':
                    key = item.category_level_1_name;
                    break;
                case 'code':
                    key = item.loss_category_code[0];
                    break;
                case 'category':
                    key = item.category_short_name;
                    break;
                default:
                    key = item.category_level_1_name;
            }

            const value = item[selectedMetric as keyof MortalityCategoryRate] as number;
            grouped.set(key, (grouped.get(key) || 0) + (value ?? 0));
        });

        return Array.from(grouped.entries()).map(([name, value], i) => ({
            name,
            value,
            color: CHART_COLORS[i % CHART_COLORS.length],
        }));
    }, [mortalityCategories, selectedMetric, grouping]);


    // Calculate summary statistics
    const summaryStats = useMemo(() => {
        if (!mortalityCategories.length) return null;

        const totalLoss = mortalityCategories.reduce((sum, item) => sum + item.loss_count, 0);
        const totalMortality = mortalityCategories.reduce((sum, item) => sum + item.mortality_count, 0);
        const totalCulling = mortalityCategories.reduce((sum, item) => sum + item.culling_count, 0);
        const avgLossRate = mortalityCategories.reduce((sum, item) => sum + item.loss_rate, 0) / mortalityCategories.length;

        return {
            totalLoss,
            totalMortality,
            totalCulling,
            avgLossRate: avgLossRate.toFixed(2),
            totalCategories: new Set(mortalityCategories.map(item => item.loss_category_code)).size,
            totalPeriods: new Set(mortalityCategories.map(item => item.period)).size
        };
    }, [mortalityCategories]);

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

    const selectedMetricLabel = METRIC_OPTIONS.find(opt => opt.value === selectedMetric)?.label || selectedMetric;

    return (
        <div>
            <Group justify="space-between" align="flex-end" mb="lg">
                <Title order={1}>
                    Dødelighets Trender
                    {summaryStats && (
                        <Text size="sm" c="dimmed" component="span" ml="sm">
                            ({summaryStats.totalPeriods} perioder, {summaryStats.totalCategories} kategorier)
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
                            onClick={() => downloadChartData(mortalityCategories)}
                        >
                            Last ned CSV
                        </Button>
                    )}
                </Group>
            </Group>

            {summaryStats && (
                <Grid mb="lg">
                    <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <Card withBorder>
                            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                                Totalt tap
                            </Text>
                            <Text fw={700} size="xl">
                                {summaryStats.totalLoss.toLocaleString()}
                            </Text>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <Card withBorder>
                            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                                Dødelighet
                            </Text>
                            <Text fw={700} size="xl">
                                {summaryStats.totalMortality.toLocaleString()}
                            </Text>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <Card withBorder>
                            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                                Utkasting
                            </Text>
                            <Text fw={700} size="xl">
                                {summaryStats.totalCulling.toLocaleString()}
                            </Text>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <Card withBorder>
                            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                                Snitt tap rate
                            </Text>
                            <Text fw={700} size="xl">
                                {summaryStats.avgLossRate}%
                            </Text>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <Card withBorder>
                            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                                Kategorier
                            </Text>
                            <Text fw={700} size="xl">
                                {summaryStats.totalCategories}
                            </Text>
                        </Card>
                    </Grid.Col>
                </Grid>
            )}

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
                    </Group>
                </Group>

                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <Select
                            label="Måling"
                            value={selectedMetric}
                            onChange={(value) => value && setSelectedMetric(value)}
                            data={METRIC_OPTIONS}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <Select
                            label="Gruppering"
                            value={grouping}
                            onChange={(value) => value && setGrouping(value)}
                            data={GROUPING_OPTIONS}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <Select
                            label="Diagram type"
                            value={chartType}
                            onChange={(value) => value && setChartType(value)}
                            data={CHART_TYPE_OPTIONS}
                        />
                    </Grid.Col>
                </Grid>
            </Paper>

            {chartData && (
                <Paper shadow="sm" p="md">
                    <Group justify="space-between" align="center" mb="md">
                        <Text size="lg" fw={600}>
                            {selectedMetricLabel} - Trend over tid
                        </Text>

                        <Group>
                            <Tooltip label="Diagram informasjon">
                                <ActionIcon variant="subtle" size="sm">
                                    <IconInfoCircle size="1rem" />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>

                    <div style={{ height: '500px', width: '100%' }}>
                        <StackedBarChart
                            data={chartData}
                            title=""
                            width="100%"
                            height={500}
                            horizontal={showHorizontal}
                            showValues={showValues}
                        />
                    </div>

                    <Text size="xs" c="dimmed" mt="sm">
                        Basert på {mortalityCategories.length} datapunkter.
                        Sist oppdatert: {new Date().toLocaleString('nb-NO')}
                    </Text>
                </Paper>



            )}

            <Paper shadow="sm" p="md" mt="xl">
                <Text size="lg" fw={600} mb="md">
                    {selectedMetricLabel} - Fordeling per gruppe
                </Text>

                <div style={{ height: '400px', width: '100%' }}>
                    <PieChart
                        data={pieChartData}
                        title=""
                        width="100%"
                        height={400}
                        innerradius={60}
                        showLabels
                    />
                </div>

                <Text size="xs" c="dimmed" mt="sm">
                    Viser fordeling av valgt måling for alle grupper.
                </Text>
            </Paper>

            <Paper shadow="sm" p="md" mt="xl">
                <Text size="lg" fw={600} mb="md">
                    Detaljert Kategori Oversikt
                </Text>

                <ScrollArea style={{ height: '400px' }}>
                    <MortalityCategoryRateTable
                        mortalityCategoryRates={mortalityCategories}
                    />

                </ScrollArea>
            </Paper>


        </div>
    );
}