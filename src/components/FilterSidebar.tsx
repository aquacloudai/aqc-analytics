import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Title,
  Stack,
  Checkbox,
  ScrollArea,
  ActionIcon,
  Divider,
  Group,
  Text,
  Collapse,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { DatePickerInput } from '@mantine/dates';
import { IconChevronLeft, IconChevronRight, IconCalendar, IconFilter } from '@tabler/icons-react';
import type { ProductionArea } from '../types/production_area';

interface FilterSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  productionAreas: ProductionArea[];
  selectedAreas: string[];
  onAreaToggle: (areaId: string) => void;
  startDate?: Date | null;
  endDate?: Date | null;
  onDateChange?: (startDate: Date | null, endDate: Date | null) => void;
}

export function FilterSidebar({
  isOpen,
  onToggle,
  productionAreas,
  selectedAreas,
  onAreaToggle,
  startDate,
  endDate,
  onDateChange,
}: FilterSidebarProps) {
  const [dateFiltersOpen, setDateFiltersOpen] = useState(true);
  const [areaFiltersOpen, setAreaFiltersOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      onToggle();
    }
  }, [isMobile, isOpen, onToggle]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <Box
          onClick={onToggle}
          style={{
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
      
      <Box
        style={{
          position: 'fixed',
          top: '60px',
          right: 0,
          height: 'calc(100vh - 60px)',
          width: isOpen ? '320px' : '0px',
          transition: 'width 0.3s ease',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
      {/* Toggle Button - always visible */}
      <ActionIcon
        onClick={onToggle}
        variant="filled"
        color="blue"
        size="lg"
        style={{
          position: 'fixed',
          top: '80px',
          right: isOpen ? '330px' : '10px',
          zIndex: 1001,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          transition: 'right 0.3s ease',
        }}
      >
        {isOpen ? <IconChevronRight size={20} /> : <IconFilter size={20} />}
      </ActionIcon>

      {/* Sidebar Content */}
      <Paper
        p="md"
        radius={0}
        bg="dark.8"
        style={{
          height: '100%',
          width: '320px',
          borderLeft: '1px solid #4a5568',
          overflow: 'hidden',
        }}
      >
        <Stack gap="md" style={{ height: '100%', paddingTop: '10px' }}>
          <Title order={3} c="white" size="lg">
            Filtere
          </Title>

          {/* Date Filters Section */}
          <Box>
            <Group
              justify="space-between"
              style={{ cursor: 'pointer' }}
              onClick={() => setDateFiltersOpen(!dateFiltersOpen)}
            >
              <Text c="white" fw={500} size="sm">
                Datofilter
              </Text>
              <ActionIcon variant="transparent" size="sm">
                <IconCalendar size={16} color="white" />
              </ActionIcon>
            </Group>
            <Collapse in={dateFiltersOpen}>
              <Stack gap="sm" mt="xs">
                <DatePickerInput
                  label="Fra dato"
                  placeholder="Velg startdato"
                  value={startDate}
                  onChange={(date) => onDateChange?.(date, endDate)}
                  clearable
                  styles={{
                    label: { color: 'white', fontSize: '12px' },
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: '#4a5568',
                      color: 'white',
                      '&::placeholder': { color: '#a0aec0' },
                    },
                  }}
                />
                <DatePickerInput
                  label="Til dato"
                  placeholder="Velg sluttdato"
                  value={endDate}
                  onChange={(date) => onDateChange?.(startDate, date)}
                  clearable
                  styles={{
                    label: { color: 'white', fontSize: '12px' },
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: '#4a5568',
                      color: 'white',
                      '&::placeholder': { color: '#a0aec0' },
                    },
                  }}
                />
              </Stack>
            </Collapse>
          </Box>

          <Divider color="dark.4" />

          {/* Production Areas Filter Section */}
          <Box>
            <Group
              justify="space-between"
              style={{ cursor: 'pointer' }}
              onClick={() => setAreaFiltersOpen(!areaFiltersOpen)}
            >
              <Text c="white" fw={500} size="sm">
                Produksjonsområde
              </Text>
              <Text c="dimmed" size="xs">
                {selectedAreas.length}/{productionAreas.length}
              </Text>
            </Group>
            <Collapse in={areaFiltersOpen}>
              <ScrollArea style={{ flex: 1, maxHeight: '300px' }} mt="xs">
                <Stack gap="xs">
                  {productionAreas.map((area) => (
                    <Checkbox
                      key={area.area_id}
                      label={area.area_name}
                      checked={selectedAreas.includes(area.area_id)}
                      onChange={() => onAreaToggle(area.area_id)}
                      styles={{
                        label: { color: 'white', fontSize: '14px' },
                        input: { backgroundColor: 'transparent' },
                      }}
                    />
                  ))}
                </Stack>
              </ScrollArea>
            </Collapse>
          </Box>
        </Stack>
      </Paper>
    </Box>
    </>
  );
}