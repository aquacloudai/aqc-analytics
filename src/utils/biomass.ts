import type { AquacloudFdirBiomassPerMonth } from '../types/aquacloud_fdir_biomass_per_month';

export function transformBiomassChartData(data: AquacloudFdirBiomassPerMonth[]) {
  const aggregationMap = new Map<string, { fdir: number; aqc: number }>();
  for (const item of data) {
    const key = item.month.slice(0, 7);
    if (!aggregationMap.has(key)) aggregationMap.set(key, { fdir: 0, aqc: 0 });
    const current = aggregationMap.get(key)!;
    current.fdir += item.fiskeridirektoratet_biomass_in_tons ?? 0;
    current.aqc += item.aquacloud_biomass_in_tons ?? 0;
  }

  const sortedMonths = Array.from(aggregationMap.keys()).sort();
  const months = sortedMonths.map(month => {
    const [year, monthNum] = month.split('-');
    return new Date(Number(year), Number(monthNum) - 1).toLocaleDateString('nb-NO', { year: 'numeric', month: 'short' });
  });

  return {
    months,
    fdirData: sortedMonths.map(m => aggregationMap.get(m)!.fdir),
    aquacloudData: sortedMonths.map(m => aggregationMap.get(m)!.aqc),
    yAxisMax: Math.ceil(Math.max(...Array.from(aggregationMap.values()).flatMap(v => [v.fdir, v.aqc])) * 1.1)
  };
}

export function getBiomassChartOptions(chartData: ReturnType<typeof transformBiomassChartData>, isDark: boolean) {
  const textColor = isDark ? '#C1C2C5' : '#495057';
  const gridColor = isDark ? '#373A40' : '#E9ECEF';
  const backgroundColor = isDark ? '#1A1B1E' : '#FFFFFF';

  return {
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 750,
    grid: { left: 80, right: 40, top: 60, bottom: 100, containLabel: true },
    xAxis: {
      type: 'category',
      data: chartData.months,
      axisLine: { lineStyle: { color: textColor } },
      axisTick: { lineStyle: { color: textColor } },
      axisLabel: { color: textColor, fontSize: 11, rotate: -45, margin: 15 }
    },
    yAxis: {
      type: 'value',
      name: 'Biomass (tons)',
      nameTextStyle: { color: textColor, fontSize: 12 },
      max: chartData.yAxisMax,
      axisLine: { lineStyle: { color: textColor } },
      axisTick: { lineStyle: { color: textColor } },
      axisLabel: {
        color: textColor, fontSize: 11,
        formatter: (value: number) =>
          value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` :
          value >= 1_000 ? `${(value / 1_000).toFixed(0)}K` :
          value.toString()
      },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.5 } }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor,
      borderColor: isDark ? '#90D0D7' : '#228BE6',
      borderWidth: 1,
      textStyle: { color: textColor },
      formatter: (params: any) =>
        `<strong>${params[0].axisValue}</strong><br/>` +
        params.map((p: any) =>
          `${p.marker} ${p.seriesName}: ${p.value.toLocaleString()} tons`
        ).join('<br/>')
    },
    legend: {
      data: ['Fiskeridirektoratet', 'AquaCloud'],
      textStyle: { color: textColor },
      top: 10,
      itemGap: 20
    },
    series: [
      {
        name: 'Fiskeridirektoratet',
        type: 'bar',
        data: chartData.fdirData,
        itemStyle: { color: '#228BE6', borderRadius: [2, 2, 0, 0] },
        emphasis: { itemStyle: { color: '#1971C2' } },
        barMaxWidth: 50
      },
      {
        name: 'AquaCloud',
        type: 'bar',
        data: chartData.aquacloudData,
        itemStyle: { color: '#FAB005', borderRadius: [2, 2, 0, 0] },
        emphasis: { itemStyle: { color: '#F59F00' } },
        barMaxWidth: 50
      }
    ]
  };
}
