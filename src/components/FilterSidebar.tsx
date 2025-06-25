import { useState, useEffect } from 'react';
import {
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
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { MonthPickerInput } from '@mantine/dates';
import { 
  IconChevronRight, 
  IconCalendar, 
  IconFilter, 
  IconX, 
  IconSearch,
  IconAdjustments,
  IconRefresh,
  IconChevronDown,
  IconChevronUp
} from '@tabler/icons-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  startDate?: Date | null;
  endDate?: Date | null;
  onDateChange?: (startDate: Date | null, endDate: Date | null) => void;
}

export function FilterSidebar({
  isOpen,
  onToggle,
  startDate,
  endDate,
  onDateChange,
}: FilterSidebarProps) {
  const [dateFiltersOpen, setDateFiltersOpen] = useState(true);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedUtsett, setSelectedUtsett] = useState<string | null>(null);
  const [weightRange, setWeightRange] = useState<[number, number]>([0, 10000]);
  const [minWeight, setMinWeight] = useState<number>(0);
  const [maxWeight, setMaxWeight] = useState<number>(10000);
  const [includeOwnData, setIncludeOwnData] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Mock data for demonstration
  const areas = [
    'Nord-Norge', 'Midt-Norge', 'Vestlandet', 'Østlandet', 'Sørlandet'
  ];
  
  const utsettOptions = [
    'Utsett 2023 - Vinter', 'Utsett 2023 - Vår', 'Utsett 2023 - Sommer', 
    'Utsett 2024 - Vinter', 'Utsett 2024 - Vår', 'Utsett 2024 - Sommer'
  ];

  const categories = ['Torsk', 'Laks', 'Ørret', 'Sei', 'Hyse', 'Makrell'];

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedArea) count++;
    if (selectedUtsett) count++;
    if (weightRange[0] > 0 || weightRange[1] < 10000) count++;
    if (startDate || endDate) count++;
    if (!includeOwnData) count++;
    if (searchTerm) count++;
    if (selectedCategories.length > 0) count++;
    return count;
  };

  const resetFilters = () => {
    setSelectedArea(null);
    setSelectedUtsett(null);
    setWeightRange([0, 10000]);
    setMinWeight(0);
    setMaxWeight(10000);
    setIncludeOwnData(true);
    setSearchTerm('');
    setSelectedCategories([]);
    onDateChange?.(null, null);
  };

  const handleWeightRangeChange = (value: [number, number]) => {
    setWeightRange(value);
    setMinWeight(value[0]);
    setMaxWeight(value[1]);
  };

  const handleMinWeightChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    setMinWeight(numValue);
    setWeightRange([numValue, maxWeight]);
  };

  const handleMaxWeightChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    setMaxWeight(numValue);
    setWeightRange([minWeight, numValue]);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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
        <ActionIcon
          onClick={onToggle}
          variant="filled"
          color="blue"
          size="xl"
          style={{
            position: 'fixed',
            top: '80px',
            right: isOpen ? (isMobile ? '20px' : '390px') : '20px',
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
        >
          {isOpen ? <IconX size={24} /> : <IconFilter size={24} />}
          {activeFiltersCount > 0 && !isOpen && (
            <Badge
              size="xs"
              color="red"
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
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
        </ActionIcon>

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
              <Select
                label="Område"
                placeholder="Velg område"
                data={areas}
                value={selectedArea}
                onChange={setSelectedArea}
                clearable
                searchable
                styles={{
                  input: {
                    '&:focus': {
                      borderColor: '#1976d2',
                    }
                  }
                }}
              />

              {/* Utsett Selection */}
              <Select
                label="Utsett"
                placeholder="Velg utsett"
                data={utsettOptions}
                value={selectedUtsett}
                onChange={setSelectedUtsett}
                clearable
                searchable
                styles={{
                  input: {
                    '&:focus': {
                      borderColor: '#1976d2',
                    }
                  }
                }}
              />

              <Divider />

              {/* Weight Range */}
              <Box>
                <Text fw={500} size="sm" mb="sm">
                  Vektintervall (gram)
                </Text>
                <RangeSlider
                  value={weightRange}
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
                    value={minWeight}
                    onChange={handleMinWeightChange}
                    min={0}
                    max={maxWeight}
                    suffix=" g"
                  />
                  <NumberInput
                    label="Max vekt"
                    value={maxWeight}
                    onChange={handleMaxWeightChange}
                    min={minWeight}
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
                      value={startDate}
                      onChange={(date) => onDateChange?.(date as Date | null, endDate as Date | null)}
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
                      placeholder="Velg slutmåned"
                      value={endDate}
                      onChange={(date) => onDateChange?.(startDate as Date | null, date as Date | null)}
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
                checked={includeOwnData}
                onChange={(event) => setIncludeOwnData(event.currentTarget.checked)}
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
                onClick={onToggle}
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