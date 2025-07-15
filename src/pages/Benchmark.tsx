import { Stack, Text } from '@mantine/core';

import { useLossByGeneration } from '../hooks/lossMortality/useLossByGeneration';
import { useLossByAreaAndMonth } from '../hooks/lossMortality/useLossByAreaAndMonth';
import { useState, useMemo, useEffect } from 'react';

import { useFilterStore } from '../store/filterStore';

import { BenchmarkAreaSection } from '../components/BenchmarkAreaSection';
import { BenchmarkGenerationSection } from '../components/BenchmarkGenerationSection';


export function Benchmark() {
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  const {
    selectedArea,
    selectedGeneration,
    weightRangeStart,
    weightRangeEnd,
    include_self,
    from_month,
    to_month,
  } = useFilterStore();

  const params = useMemo(() => ({
    area: selectedArea ?? '%',
    generation: selectedGeneration && selectedGeneration.length > 0
      ? selectedGeneration.join(',')
      : undefined,
    weight_range_start: weightRangeStart,
    weight_range_end: weightRangeEnd,
    include_self,
    from_month: from_month ? from_month.format('YYYY-MM-DD') : undefined,
    to_month: to_month ? to_month.format('YYYY-MM-DD') : undefined,
  }), [
    selectedArea,
    selectedGeneration,
    weightRangeStart,
    weightRangeEnd,
    include_self,
    from_month,
    to_month,
  ]);


  const { data: lossByGeneration = [], loading, error, refetch, apiDetails } = useLossByGeneration(params);

  const areaParams = useMemo(() => ({
    area: selectedArea ?? '%',
    generation: selectedGeneration && selectedGeneration.length > 0
      ? selectedGeneration.join(',')
      : undefined,
    weight_range_start: weightRangeStart,
    weight_range_end: weightRangeEnd,
    include_self,
    from_month: from_month ? from_month.format('YYYY-MM-DD') : undefined,
    to_month: to_month ? to_month.format('YYYY-MM-DD') : undefined,
    limit: 1000,
    offset: 0,
  }), [
    selectedArea,
    selectedGeneration,
    weightRangeStart,
    weightRangeEnd,
    include_self,
    from_month,
    to_month,
  ]);

  const {
    data: areaData = [],
    loading: areaLoading,
    error: areaError,
    refetch: areaRefetch
  } = useLossByAreaAndMonth(areaParams);
  const areaSourceOptions = [
    { label: "Aquacloud", value: "aquacloud" },
    { label: "Farmer", value: "farmer" },
    { label: "Fiskeridirektoratet", value: "fdir" },
  ];

  const areaList = useMemo(() => {
    if (!areaData) return [];
    return Array.from(new Set(areaData.map(d => d.aquacloud_area_name))).sort();
  }, [areaData]);

  // Create all combinations for selection
  const selectableAreaSources = useMemo(() => {
    return areaList.flatMap(area =>
      areaSourceOptions.map(source => ({
        value: `${area}__${source.value}`,
        label: `${area} (${source.label})`,
        area,
        source: source.value,
      }))
    );
  }, [areaList]);

  const [selectedAreaSources, setSelectedAreaSources] = useState<string[]>([]);

  useEffect(() => {
    if (selectedAreaSources.length === 0 && selectableAreaSources.length > 0) {
      setSelectedAreaSources([selectableAreaSources[0].value]);
    }
  }, [selectableAreaSources, selectedAreaSources.length]);


  const generations = useMemo(() => {
    if (!lossByGeneration) return [];
    const unique = Array.from(new Set(lossByGeneration.map((d) => d.generation))).sort();
    return unique.map((g) => ({ value: g, label: g }));
  }, [lossByGeneration]);

  useEffect(() => {
    if (!initialized && generations.length > 0 && selectedGenerations.length === 0) {
      const hasH2024 = generations.some((g) => g.value === 'H2024');
      setSelectedGenerations([hasH2024 ? 'H2024' : generations[0].value]);
      setInitialized(true);
    }
  }, [generations, initialized, selectedGenerations.length]);


  return (
    <Stack gap="lg">
      <BenchmarkAreaSection
        areaData={areaData}
        loading={areaLoading}
        error={areaError}
        refetch={areaRefetch}
      />
      <BenchmarkGenerationSection
        lossByGeneration={lossByGeneration}
        loading={loading}
        error={error}
        refetch={refetch}
        apiDetails={apiDetails}
      />
      <Text>{selectedGeneration && selectedGeneration.join(', ')}</Text>
    </Stack>
  );
}
