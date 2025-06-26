import { useState, useMemo, useEffect } from 'react';
import {
  Paper,
  Title,
  Text,
  Box,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { ProductionArea } from '../types/production_area';
import type { TemperatureTrendData } from '../types/temperature_trend';
import api from '../api/auth/apiClient';
import { isKeycloakReady } from '../config/keycloak';
import { LineChart } from 'aqc-charts';
import type { ChartSeries, LegendConfig, TooltipConfig } from 'aqc-charts';
import { FilterSidebar } from '../components/FilterSidebar';


export function Temperature() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [productionAreas, setProducionAreas] = useState<ProductionArea[]>([]);
  const [temperatureTrendData, setTemperatureTrendData] = useState<TemperatureTrendData[]>([]);

  useEffect(() => {
    if (!isKeycloakReady()) return; // wait until Keycloak is initialized

    const fetchProductionAreas = async () => {
      try {
        const response = await api.get<{ data: ProductionArea[] }>('/v3/common/production-area');
        const areas = response.data?.data || [];
        setProducionAreas(areas);
        // Set first 2 areas as selected by default
        if (areas.length > 0) {
          setSelectedAreas(areas.slice(0, 2).map(area => area.area_id));
        }
      } catch (error) {
        console.error('[Temperature] Failed to fetch production areas:', error);
      }
    };
    const fetchTemp = async () => {
      try {
        const response = await api.get<{ data: TemperatureTrendData[] }>('/v3/environment/temperature-trends-by-region');
        setTemperatureTrendData(response.data?.data || []);
      } catch (error) {
        console.error('[Temperature] Failed to fetch temperature data:', error);
      }
    };

    fetchProductionAreas();
    fetchTemp();
  }, [isKeycloakReady()]);



  const handleAreaToggle = (areaId: string) => {
    setSelectedAreas(prev =>
      prev.includes(areaId)
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const chartData = useMemo(() => {
    if (selectedAreas.length === 0 || temperatureTrendData.length === 0) return null;

    const series: ChartSeries[] = [];
    const colors = ['#FFD93D', '#6BCF7F', '#4D9DE0', '#E15554', '#F18F01'];

    // Filter data by date range if dates are selected
    let filteredData = temperatureTrendData;
    if (startDate || endDate) {
      filteredData = temperatureTrendData.filter(item => {
        const itemDate = new Date(item.week);
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      });
    }

    // Group temperature data by area and group (depth)
    const groupedData = filteredData.reduce((acc, item) => {
      const key = `${item.area_name}-${item.group}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, TemperatureTrendData[]>);

    // Get all unique weeks/dates for x-axis
    const allWeeks = Array.from(new Set(filteredData.map(item => item.week))).sort();

    selectedAreas.forEach((areaId, areaIndex) => {
      const area = productionAreas.find(a => a.area_id === areaId);
      if (!area) return;

      // Get unique groups (depths) for this area
      const areaGroups = Array.from(new Set(
        temperatureTrendData
          .filter(item => item.area_name === area.area_name)
          .map(item => item.group)
      ));

      areaGroups.forEach((group, groupIndex) => {
        const key = `${area.area_name}-${group}`;
        const groupData = groupedData[key] || [];

        // Sort by week and extract temperature values
        const sortedData = groupData.sort((a, b) => a.week.localeCompare(b.week));
        const temperatureValues = allWeeks.map(week => {
          const dataPoint = sortedData.find(item => item.week === week);
          return dataPoint ? dataPoint.temperature : null;
        });

        // Determine line style based on group name
        let lineType: 'solid' | 'dotted' | 'dashed' = 'solid';
        let symbol: 'circle' | 'none' = 'none';
        if (group.toLowerCase().includes('overflate') || group.toLowerCase().includes('surface')) {
          lineType = 'dotted';
          symbol = 'circle';
        } else if (group.toLowerCase().includes('dyp') || group.toLowerCase().includes('deep')) {
          lineType = 'dashed';
        }

        series.push({
          name: `${group} - ${area.area_name}`,
          type: 'line',
          data: temperatureValues,
          color: colors[areaIndex % colors.length],
          lineStyle: {
            type: lineType,
            width: 2,
          },
          symbol: symbol,
          symbolSize: 4,
          smooth: true,
          connectNulls: false,
        });
      });
    });

    // Format weeks for display
    const xAxisData = allWeeks.map(week => {
      const date = new Date(week);
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      return `${month} ${day}`;
    });

    // Get date range for subtitle
    const dateRange = allWeeks.length > 0
      ? `${allWeeks[0]} - ${allWeeks[allWeeks.length - 1]}`
      : '';

    return {
      series,
      xAxisData,
      dateRange,
    };
  }, [selectedAreas, temperatureTrendData, productionAreas, startDate, endDate]);

  return (
    <Box style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', background: '#1a365d' }}>
      <Box p="md">
        <Title order={1} c="white">Sjøtemperatur</Title>
      </Box>

      <Box style={{ 
        flex: 1, 
        display: 'flex', 
        padding: '0 1rem 1rem 1rem', 
        paddingRight: (sidebarOpen && !isMobile) ? '340px' : '1rem', // Add space for fixed sidebar on desktop only
        transition: 'padding-right 0.3s ease',
      }}>
        <FilterSidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          productionAreas={productionAreas}
          selectedAreas={selectedAreas}
          onAreaToggle={handleAreaToggle}
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />

        <Box style={{ flex: 1, minHeight: 0 }}>
          <Paper p="lg" radius="md" bg="dark.8" style={{ height: '100%' }}>
            {chartData ? (
              <LineChart
                data={chartData.series}
                width="100%"
                height="100%"
                title={{
                  text: 'Temperaturutvikling per område og dybde',
                  subtext: chartData.dateRange,
                  textStyle: {
                    color: '#ffffff',
                    fontSize: 18,
                    fontWeight: 'bold',
                  },
                  subtextStyle: {
                    color: '#a0aec0',
                    fontSize: 12,
                  },
                  left: 'left',
                }}
                xAxis={{
                  type: 'category',
                  data: chartData.xAxisData,
                  axisLabel: {
                    color: '#a0aec0',
                    rotate: 45,
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#4a5568',
                    },
                  },
                }}
                yAxis={{
                  type: 'value',
                  name: 'Temperatur (°C)',
                  nameTextStyle: {
                    color: '#ffffff',
                  },
                  axisLabel: {
                    color: '#a0aec0',
                    formatter: '{value}°C'
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#4a5568',
                    },
                  },
                  splitLine: {
                    lineStyle: {
                      color: '#2d3748',
                    },
                  },
                }}
                legend={{
                  type: 'scroll',
                  orient: 'vertical',
                  right: 10,
                  top: 20,
                  bottom: 20,
                  textStyle: {
                    color: '#ffffff',
                  },
                  pageTextStyle: {
                    color: '#ffffff',
                  },
                }}
                tooltip={{
                  trigger: 'axis',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderColor: '#4a5568',
                  textStyle: {
                    color: '#ffffff',
                  },
                  formatter: (params: any) => {
                    if (!Array.isArray(params)) return '';

                    let tooltip = `<div style="margin-bottom: 8px;"><strong>${params[0].axisValue}</strong></div>`;
                    params.forEach((param: any) => {
                      if (param.value !== null) {
                        tooltip += `<div style="margin: 4px 0;">
                          <span style="color: ${param.color};">●</span> 
                          ${param.seriesName}: <strong>${param.value}°C</strong>
                        </div>`;
                      }
                    });
                    return tooltip;
                  },
                }}
                theme={{
                  backgroundColor: '#1a365d',
                  textStyle: {
                    color: '#ffffff',
                  },
                }}
              />
            ) : (
              <Box ta="center" pt="xl">
                <Text c="dimmed">Velg produksjonsområder for å vise temperaturdata</Text>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}