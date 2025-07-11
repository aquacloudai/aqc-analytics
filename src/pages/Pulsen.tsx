import React, { useMemo, useState } from "react";
import {
    Box,
    Title,
    Stack,
    Text,
    Loader,
    Alert,
    Slider,
    Paper,
    ScrollArea,
    Table,
    Badge,
    Group,
    ActionIcon,
    Tooltip,
    Button,
    Card,
    Grid,
    Switch,
    Divider
} from "@mantine/core";
import {
    IconRefresh,
    IconDownload,
    IconSettings,
    IconEye,
    IconInfoCircle,
    IconAlertCircle
} from "@tabler/icons-react";
import { LineChart } from "aqc-charts";
import { useLossByWeek } from "../hooks/lossMortality/useLossByWeek";
import { useLossByAreaAndWeek } from "../hooks/lossMortality/useLossByAreaAndWeek.ts";
import type { MortalityCategoryByWeekRecord } from "../types/loss_mortality_by_week";
import type { MortalityCategoryByAreaAndWeekRecord } from "../types/loss_mortality_by_area_and_week";
import { ApiInfoModal } from "../components/ApiInfoModal";
import type { ApiDetail } from "../types/api_detail.ts";

// --- Pivot for week/category line chart ---
function pivotData(rawData: MortalityCategoryByWeekRecord[] | undefined) {
    if (!rawData) return { chartData: [], allWeeks: [], categories: [], categoryNames: {} };
    const allWeeks = [...new Set(rawData.map(d => d.loss_week))].sort();
    const categories = [...new Set(rawData.map(d => d.loss_category_code))];
    const categoryNames = Object.fromEntries(
        rawData.map(d => [d.loss_category_code, d.loss_category_name])
    );
    const weekMap: Record<string, Record<string, any>> = {};
    for (const week of allWeeks) weekMap[week] = { loss_week: week };
    for (const entry of rawData) {
        weekMap[entry.loss_week][entry.loss_category_code] = entry.mortality_rate;
    }
    return {
        chartData: Object.values(weekMap),
        allWeeks,
        categories,
        categoryNames,
    };
}

// --- Pivot for area+week chart (each area is a line) ---
function pivotAreaData(rawData: MortalityCategoryByAreaAndWeekRecord[] | undefined) {
    if (!rawData) return { chartData: [], allWeeks: [], areas: [] };
    const allWeeks = [...new Set(rawData.map(d => d.loss_rate_week))].sort();
    const areas = [...new Set(rawData.map(d => d.aquacloud_area_name))];
    const weekMap: Record<string, Record<string, any>> = {};
    for (const week of allWeeks) weekMap[week] = { week, ...areas.reduce((acc, area) => ({ ...acc, [area]: null }), {}) };
    for (const entry of rawData) {
        weekMap[entry.loss_rate_week][entry.aquacloud_area_name] = entry.mortality_rate;
    }
    return {
        chartData: Object.values(weekMap),
        allWeeks,
        areas,
    };
}

const formatAndel = (num: number | null | undefined): string => {
    if (num == null) return '–';
    return `${(num * 100).toFixed(1)}%`;
};

export function Pulsen() {
    const [weekCount, setWeekCount] = useState<number>(4);
    const [showTable, setShowTable] = useState(true);
    const [showAreaChart, setShowAreaChart] = useState(true);
    const [showApiModal, setShowApiModal] = useState(false);

    // --- Data for first chart/table ---
    const { data: weekRaw, apiDetails: weekApiDetails, loading: loading1, error: error1, refetch: refetch1 } = useLossByWeek(weekCount);
    const { chartData, allWeeks, categories, categoryNames } = useMemo(
        () => pivotData(weekRaw),
        [weekRaw]
    );

    // --- Data for area/line chart ---
    const { data: areaRaw, apiDetails: areaApiDetails, loading: loading2, error: error2, refetch: refetch2 } = useLossByAreaAndWeek(weekCount);
    const { chartData: areaChartData, allWeeks: areaWeeks, areas } = useMemo(
        () => pivotAreaData(areaRaw),
        [areaRaw]
    );

    const lines = categories.map((cat, i) => ({
        key: cat,
        name: categoryNames[cat] || cat,
        color: `hsl(${(i * 50) % 360}, 60%, 45%)`,
    }));

    const areaLines = areas.map((area, i) => ({
        key: area,
        name: area,
        color: `hsl(${(i * 90) % 360}, 60%, 45%)`,
    }));

    const weekLabel = (w?: string) => (w ? w.slice(5) : "");

    // Summary stats
    const summaryStats = useMemo(() => {
        if (!chartData.length) return null;

        const totalWeeks = chartData.length;
        const totalCategories = categories.length;
        const totalAreas = areas.length;

        return {
            totalWeeks,
            totalCategories,
            totalAreas,
            dateRange: chartData.length > 0 ? `${chartData[0].loss_week} - ${chartData[chartData.length - 1].loss_week}` : null
        };
    }, [chartData, categories, areas]);

    const handleRefresh = () => {
        refetch1();
        refetch2();
    };

    const handleDownload = () => {
        // Create CSV data
        const csvData = chartData.map(row => ({
            Uke: row.loss_week,
            ...categories.reduce((acc, cat) => ({
                ...acc,
                [categoryNames[cat] || cat]: formatAndel(row[cat])
            }), {})
        }));

        // Simple CSV download (you can replace this with your downloadChartData function)
        const csv = [
            Object.keys(csvData[0]).join(','),
            ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pulsen-data-${weekCount}-uker.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // --- Loading/Error states ---
    const loading = loading1 || loading2;
    const error = error1 || error2;

    if (loading) {
        return (
            <Stack align="center" mt="xl">
                <Loader size="lg" />
                <Text>Laster pulsen data...</Text>
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
                {error1 ? (typeof error1 === "object" && error1 !== null && "message" in error1 ? (error1 as { message: string }).message : String(error1)) : ""}
                {error2 ? (typeof error2 === "object" && error2 !== null && "message" in error2 ? (error2 as { message: string }).message : String(error2)) : ""}
                <Button
                    variant="light"
                    size="xs"
                    onClick={handleRefresh}
                    leftSection={<IconRefresh size="1rem" />}
                    mt="md"
                >
                    Prøv igjen
                </Button>
            </Alert>
        );
    }

    if (!chartData.length && !areaChartData.length) {
        return (
            <Stack align="center" mt="xl">
                <Text size="lg" c="dimmed">Ingen data tilgjengelig for valgt periode.</Text>
                <Button
                    variant="light"
                    onClick={handleRefresh}
                    leftSection={<IconRefresh size="1rem" />}
                >
                    Prøv igjen
                </Button>
            </Stack>
        );
    }

    return (
        <Stack gap="lg">
            {/* Page Header */}
            <Group justify="space-between" align="flex-end">
                <Title order={1}>
                    Pulsen
                    {summaryStats && (
                        <Text size="sm" c="dimmed" component="span" ml="sm">
                            ({summaryStats.totalWeeks} uker, {summaryStats.totalCategories} kategorier, {summaryStats.totalAreas} områder)
                        </Text>
                    )}
                </Title>

                <Group>
                    <Tooltip label="Oppdater data">
                        <ActionIcon variant="light" onClick={handleRefresh} loading={loading}>
                            <IconRefresh size="1rem" />
                        </ActionIcon>
                    </Tooltip>

                    {chartData.length > 0 && (
                        <Group>
                            <Button
                                leftSection={<IconDownload size="1rem" />}
                                variant="light"
                                onClick={handleDownload}
                            >
                                Last ned CSV
                            </Button>
                            <Button
                                leftSection={<IconInfoCircle size="1rem" />}
                                variant="light"
                                onClick={() => setShowApiModal(true)}
                            >
                                Vis API-kall
                            </Button>
                        </Group>
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
                            <Text size="lg" fw={600}>Innstillinger</Text>
                        </Group>
                    </Group>

                    {/* Week Count Slider */}
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Text size="sm" fw={500} mb="xs">
                                Antall uker: {weekCount}
                            </Text>
                            <Slider
                                value={weekCount}
                                onChange={setWeekCount}
                                min={1}
                                max={12}
                                step={1}
                                marks={[
                                    { value: 1, label: '1' },
                                    { value: 4, label: '4' },
                                    { value: 8, label: '8' },
                                    { value: 12, label: '12' },
                                ]}
                                size="md"
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
                                label="Vis tabell"
                                description="Vis data som tabell"
                                checked={showTable}
                                onChange={(e) => setShowTable(e.currentTarget.checked)}
                                size="sm"
                            />
                            <Switch
                                label="Vis område diagram"
                                description="Vis dødlighet per område"
                                checked={showAreaChart}
                                onChange={(e) => setShowAreaChart(e.currentTarget.checked)}
                                size="sm"
                            />
                        </Group>
                    </Group>

                    {/* Info Alert */}
                    {summaryStats && (
                        <Alert variant="light" color="blue" icon={<IconInfoCircle size="1rem" />}>
                            <Text size="sm">
                                <Text component="span" fw={500}>Dataperiode:</Text> {summaryStats.dateRange}
                                {summaryStats.totalWeeks > 0 && ` • ${summaryStats.totalWeeks - 1} uker med data`}
                            </Text>
                        </Alert>
                    )}
                </Stack>
            </Card>

            {/* 1. Area Chart - TOP (Full Width) */}
            {showAreaChart && areaChartData.length > 0 && (
                <Paper shadow="sm" p="md">
                    <Title order={3} mb="md">
                       Dødlighet per uke etter område
                    </Title>
                    <Box h={400} w="100%">
                        <LineChart
                            data={{
                                categories: areaChartData.map(d => d.week),
                                series: areaLines.map(line => ({
                                    name: line.name,
                                    data: areaChartData.map(d => d[line.key] ?? null),
                                    color: line.color,
                                })),
                            }}
                            xLabel="Uke"
                            yLabel="Dødlighet (%)"
                            xTickFormatter={weekLabel}
                            yTickFormatter={(v: number) => (v * 100).toFixed(1)}
                            tooltipFormatter={(v: number) => (v * 100).toFixed(2) + " %"}
                            legend
                        />
                    </Box>
                </Paper>
            )}

            {/* 2. Table - MIDDLE (Full Width) */}
            {showTable && weekRaw && weekRaw.length > 0 && (
                <Paper shadow="sm" p="md">
                    <Title order={4} mb="md">
                        Dødelighet etter kategori ({weekCount} uker)
                    </Title>
                    <Text size="sm" c="dimmed" mb="md">
                        Tabellen viser dødelighet per kategori, endring siste periode og snittverdi.
                    </Text>
                    <ScrollArea type="always" h={400}>
                        <Table striped highlightOnHover withColumnBorders>
                            <Table.Thead style={{
                                position: 'sticky',
                                top: 0,
                                zIndex: 1,
                                backgroundColor: 'var(--mantine-color-body)'
                            }}>
                                <Table.Tr>
                                    <Table.Th>Rank</Table.Th>
                                    <Table.Th>Uke</Table.Th>
                                    <Table.Th>Kategori</Table.Th>
                                    <Table.Th>Kategorinavn</Table.Th>
                                    <Table.Th>Taprate (%)</Table.Th>
                                    <Table.Th>Endring taprate (%)</Table.Th>
                                    <Table.Th>Trend siste {weekCount} uker (%)</Table.Th>
                                    <Table.Th>Dødelighet (%)</Table.Th>
                                    <Table.Th>Endring dødelighet (%)</Table.Th>
                                    <Table.Th>Trend dødelighet siste {weekCount} uker (%)</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {weekRaw.map(row => (
                                    <Table.Tr key={`${row.loss_week}-${row.loss_category_code}`}>
                                        <Table.Td>{row.rank}</Table.Td>
                                        <Table.Td>{row.loss_week}</Table.Td>
                                        <Table.Td>
                                            <Badge color="blue" variant="light" size="sm">
                                                {row.loss_category_code}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>{row.loss_category_name}</Table.Td>
                                        <Table.Td>{(row.loss_rate * 100).toFixed(2)}%</Table.Td>
                                        <Table.Td>
                                            {row.loss_rate_change == null ? "–"
                                                : ((row.loss_rate_change * 100).toFixed(2) + "%")}
                                        </Table.Td>
                                        <Table.Td>
                                            {row.trending_loss_last_n_weeks == null ? "–"
                                                : (row.trending_loss_last_n_weeks * 100).toFixed(2) + "%"}
                                        </Table.Td>
                                        <Table.Td>
                                            {row.mortality_rate == null ? "–"
                                                : (row.mortality_rate * 100).toFixed(2) + "%"}
                                        </Table.Td>
                                        <Table.Td>
                                            {row.mortality_rate_change == null ? "–"
                                                : (row.mortality_rate_change * 100).toFixed(2) + "%"}
                                        </Table.Td>
                                        <Table.Td>
                                            {row.trending_mortality_last_n_weeks == null ? "–"
                                                : (row.trending_mortality_last_n_weeks * 100).toFixed(2) + "%"}
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
            )}


            {/* 3. Category Chart - BOTTOM (Full Width) */}
            {chartData.length > 0 && (
                <Paper shadow="sm" p="md">
                    <Title order={3} mb="md">
                        Dødelighet per uke etter kategori
                    </Title>
                    <Box h={400} w="100%">
                        <LineChart
                            data={{
                                categories: chartData.map(d => d.loss_week),
                                series: lines.map(line => ({
                                    name: line.name,
                                    data: chartData.map(d => d[line.key] ?? null),
                                    color: line.color,
                                    legend: { scrollable: true },
                                })),
                            }}
                            xLabel="Uke"
                            yLabel="Dødelighet (%)"
                            xTickFormatter={weekLabel}
                            yTickFormatter={(v: number) => (v * 100).toFixed(1)}
                            tooltipFormatter={(v: number) => (v * 100).toFixed(2) + " %"}
                            legend
                        />
                    </Box>
                </Paper>
            )}

            <ApiInfoModal
                opened={showApiModal}
                onClose={() => setShowApiModal(false)}
                apiDetails={[weekApiDetails, areaApiDetails].filter((d): d is ApiDetail => d != null)}
            />
        </Stack>
    );
}