import { useState, useEffect } from 'react';
import { useFilterStore } from '../store/filterStore';
import dayjs from 'dayjs';
import {
  Alert,
  Box,
  Paper,
  Title,
  Stack,
  ActionIcon,
  Group,
  Text,
  Collapse,
  Select,
  Button,
  RangeSlider,
  Checkbox,
  Badge,
  Divider,
  Transition,
  NumberInput,
  TextInput,
  MultiSelect
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { MonthPickerInput } from '@mantine/dates';
import {
  IconCalendar,
  IconFilter,
  IconX,
  IconSearch,
  IconAdjustments,
  IconRefresh,
  IconChevronDown,
  IconChevronUp
} from '@tabler/icons-react';

import { useAquacloudAreas } from '../hooks/common/useAquacloudAreas';
import { useGenerations } from '../hooks/common/useGenerations';

interface FilterSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FilterSidebar({
  isOpen,
  onToggle,
}: FilterSidebarProps) {

  const triggerApplyFilters = useFilterStore((s) => s.triggerApplyFilters);
  // toggle states
  const [dateFiltersOpen, setDateFiltersOpen] = useState(true);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  const { data: aquacloudAreas, loading: areasLoading, error: areasError } = useAquacloudAreas();

  const { data: generations, loading: generationsLoading, error: generationsError } = useGenerations();

  // filter states
  const selectedArea = useFilterStore((s) => s.selectedArea); // string[]
  const setSelectedArea = useFilterStore((s) => s.setSelectedArea);

  const selectedGeneration = useFilterStore((s) => s.selectedGeneration); // string[]
  const setSelectedUtsett = useFilterStore((s) => s.setSelectedUtsett);


  const weightRangeStart = useFilterStore((s) => s.weightRangeStart);
  const setWeightRangeStart = useFilterStore((s) => s.setWeightRangeStart);

  const weightRangeEnd = useFilterStore((s) => s.weightRangeEnd);
  const setWeightRangeEnd = useFilterStore((s) => s.setWeightRangeEnd);

  const includeSelf = useFilterStore((s) => s.include_self);
  const setIncludeSelf = useFilterStore((s) => s.setIncludeSelf);

  const fromMonth = useFilterStore((s) => s.from_month);
  const toMonth = useFilterStore((s) => s.to_month);

  const setFromMonth = useFilterStore((s) => s.setFromMonth);
  const setToMonth = useFilterStore((s) => s.setToMonth);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');


  const areaOptions = aquacloudAreas
    ? aquacloudAreas.map(area => ({
      value: String(area.area_id),
      label: area.name,
    }))
    : [];

  const utsettOptions = generations
    ? generations.map(generation => ({
      value: String(generation.generation),
      label: generation.generation_name,
    }))
    : [];


  const categories = ['Laks', 'Ørret'];

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedArea) count++;
    if (selectedGeneration) count++;
    if (weightRangeStart) count++;
    if (weightRangeEnd) count++;
    if (includeSelf) count++;
    if (searchTerm) count++;
    if (selectedCategories.length > 0) count++;
    return count;
  };

  const resetFilters = () => {
    setSelectedArea('%');
    setSelectedUtsett([]);
    setWeightRangeStart(0);
    setWeightRangeEnd(10000);
    setFromMonth(dayjs('2024-05-01'));
    setToMonth(dayjs());
    setIncludeSelf(false);
    setSearchTerm('');
    setSelectedCategories([]);
  };

  const handleWeightRangeChange = (value: [number, number]) => {
    setWeightRangeStart(value[0]);
    setWeightRangeEnd(value[1]);
  };

  const handleWeightRangeStartChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    setWeightRangeStart(numValue);

  };

  const handleWeightRangeEndChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    setWeightRangeEnd(numValue);

  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleFromMonthChange = (date: Date | null) => {
    if (date) {
      setFromMonth(dayjs(date));
    } else {
      setFromMonth(null);
    }
  };

  const handleToMonthChange = (date: Date | null) => {
    if (date) {
      setToMonth(dayjs(date));
    } else {
      setToMonth(null);
    }
  };

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <>
      {/* Mobile Backdrop */}
      <Transition
        mounted={isOpen && isMobile}
        transition="fade"
        duration={200}
      >
        {(styles) => (
          <Box
            onClick={onToggle}
            style={{
              ...styles,
              position: 'fixed',
              top: '60px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 99,
            }}
          />
        )}
      </Transition>

      {/* Sidebar Container */}
      <Box
        style={{
          position: 'fixed',
          top: '60px',
          right: 0,
          height: 'calc(100vh - 60px)',
          width: isOpen ? (isMobile ? '100vw' : '380px') : '0px',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 100,
          overflow: 'hidden',
          boxShadow: isOpen ? '-4px 0 20px rgba(0, 0, 0, 0.15)' : 'none',
        }}
      >
        {/* Toggle Button */}
        <Box
          style={{
            position: 'fixed',
            top: '80px',
            right: isOpen ? (isMobile ? '20px' : '390px') : '20px',
            zIndex: 1001,
          }}
        >
          <ActionIcon
            onClick={onToggle}
            variant="filled"
            color="blue"
            size="xl"
            style={{
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            {isOpen ? <IconX size={24} /> : <IconFilter size={24} />}
          </ActionIcon>

          {activeFiltersCount > 0 && !isOpen && (
            <Badge
              size="xs"
              color="red"
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                zIndex: 1002,
                minWidth: 18,
                height: 18,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Box>


        {/* Sidebar Content */}
        <Paper
          radius={0}
          withBorder
          style={{
            height: '100%',
            width: isMobile ? '100vw' : '380px',
            backgroundColor: 'white',
            borderLeft: '1px solid #e9ecef',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box p="lg" style={{ borderBottom: '1px solid #e9ecef' }}>
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <IconAdjustments size={24} color="#1976d2" />
                <Title order={3} size="lg" c="dark">
                  Filtere
                </Title>
              </Group>
              {activeFiltersCount > 0 && (
                <Badge variant="filled" color="blue" size="sm">
                  {activeFiltersCount} aktive
                </Badge>
              )}
            </Group>
          </Box>

          {/* Scrollable Content */}
          <Box style={{ flex: 1, overflow: 'auto' }} p="lg">
            <Stack gap="lg">
              {/* Search */}
              <TextInput
                label="Søk"
                placeholder="Søk i data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
                styles={{
                  input: {
                    '&:focus': {
                      borderColor: '#1976d2',
                    }
                  }
                }}
              />

              <Divider />

              {/* Area Selection */}
              {areasLoading && <Text size="xs" c="dimmed">Laster områder ...</Text>}
              {areasError && <Alert color="red">{areasError}</Alert>}

              <Select
                label="Område"
                placeholder="Velg område"
                data={areaOptions}
                value={selectedArea} // string | null
                onChange={setSelectedArea}
                clearable
                searchable
              />

              <MultiSelect
                label="Utsett"
                placeholder="Velg utsett"
                data={utsettOptions}
                value={selectedGeneration}
                onChange={setSelectedUtsett}
                clearable
                searchable
              />



              <Divider />

              {/* Weight Range */}
              <Box>
                <Text fw={500} size="sm" mb="sm">
                  Vektintervall (gram)
                </Text>
                <RangeSlider
                  value={weightRangeStart !== 0 || weightRangeEnd !== 10000 ? [weightRangeStart, weightRangeEnd] : [0, 10000]}
                  onChange={handleWeightRangeChange}
                  min={0}
                  max={10000}
                  step={100}
                  marks={[
                    { value: 0, label: '0g' },
                    { value: 2500, label: '2.5kg' },
                    { value: 5000, label: '5kg' },
                    { value: 7500, label: '7.5kg' },
                    { value: 10000, label: '10kg' },
                  ]}
                  mb="md"
                  color="blue"
                />
                <Group grow>
                  <NumberInput
                    label="Min vekt"
                    value={weightRangeStart}
                    onChange={handleWeightRangeStartChange}
                    min={0}
                    max={weightRangeEnd}
                    suffix=" g"
                  />
                  <NumberInput
                    label="Max vekt"
                    value={weightRangeEnd}
                    onChange={handleWeightRangeEndChange}
                    min={weightRangeStart}
                    max={10000}
                    suffix=" g"
                  />
                </Group>
              </Box>

              <Divider />

              {/* Date Filters */}
              <Box>
                <Group
                  justify="space-between"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setDateFiltersOpen(!dateFiltersOpen)}
                  mb="xs"
                >
                  <Group gap="xs">
                    <IconCalendar size={16} color="#1976d2" />
                    <Text fw={500} size="sm">
                      Tidsperiode
                    </Text>
                  </Group>
                  <ActionIcon variant="transparent" size="sm">
                    {dateFiltersOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </ActionIcon>
                </Group>
                <Collapse in={dateFiltersOpen}>
                  <Stack gap="sm">
                    <MonthPickerInput
                      label="Fra måned"
                      placeholder="Velg startmåned"
                      value={fromMonth?.toDate() || null}
                      onChange={(value) => handleFromMonthChange(value ? new Date(value) : null)}
                      clearable
                      styles={{
                        input: {
                          '&:focus': {
                            borderColor: '#1976d2',
                          }
                        }
                      }}
                    />
                    <MonthPickerInput
                      label="Til måned"
                      placeholder="Velg sluttmåned"
                      value={toMonth?.toDate() || null}
                      onChange={(value) => handleToMonthChange(value ? new Date(value) : null)}
                      clearable
                      styles={{
                        input: {
                          '&:focus': {
                            borderColor: '#1976d2',
                          }
                        }
                      }}
                    />
                  </Stack>
                </Collapse>
              </Box>

              <Divider />


              {/* Advanced Filters */}
              <Box>
                <Group
                  justify="space-between"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
                  mb="xs"
                >
                  <Text fw={500} size="sm">
                    Avanserte filtere
                  </Text>
                  <ActionIcon variant="transparent" size="sm">
                    {advancedFiltersOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </ActionIcon>
                </Group>
                <Collapse in={advancedFiltersOpen}>
                  <Stack gap="sm">
                    <Text size="xs" c="dimmed" mb="xs">
                      Kategorier
                    </Text>
                    <Group gap="xs">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategories.includes(category) ? 'filled' : 'light'}
                          color={selectedCategories.includes(category) ? 'blue' : 'gray'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                </Collapse>
              </Box>

              <Divider />

              {/* Options */}
              <Checkbox
                label="Inkluder egne data"
                checked={includeSelf}
                onChange={(event) => setIncludeSelf(event.currentTarget.checked)}
                color="blue"
              />
            </Stack>
          </Box>

          {/* Footer Actions */}
          <Box p="lg" style={{ borderTop: '1px solid #e9ecef' }}>
            <Group grow>
              <Button
                variant="light"
                color="gray"
                onClick={resetFilters}
                leftSection={<IconRefresh size={16} />}
                disabled={activeFiltersCount === 0}
              >
                Nullstill
              </Button>
              <Button
                variant="filled"
                color="blue"
                onClick={() => {
                  triggerApplyFilters();
                  onToggle(); // closes sidebar
                }}
              >
                Bruk filtere
              </Button>
            </Group>
          </Box>
        </Paper>
      </Box>
    </>
  );
}