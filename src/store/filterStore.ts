import { create } from 'zustand';
import dayjs, { Dayjs } from 'dayjs';

export interface FilterState {
  // Date range filters
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  
  // Farm filters
  selectedFarms: string[];
  selectedPens: string[];
  selectedBatches: string[];
  
  // Data filters
  showOwnDataOnly: boolean;
  aggregationLevel: 'daily' | 'weekly' | 'monthly' | 'yearly';
  
  // Metric filters
  selectedMetrics: string[];
  
  // Actions
  setDateRange: (start: Dayjs | null, end: Dayjs | null) => void;
  setSelectedFarms: (farms: string[]) => void;
  setSelectedPens: (pens: string[]) => void;
  setSelectedBatches: (batches: string[]) => void;
  setShowOwnDataOnly: (show: boolean) => void;
  setAggregationLevel: (level: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  setSelectedMetrics: (metrics: string[]) => void;
  resetFilters: () => void;
}

const defaultState = {
  startDate: dayjs().subtract(30, 'days'),
  endDate: dayjs(),
  selectedFarms: [],
  selectedPens: [],
  selectedBatches: [],
  showOwnDataOnly: false,
  aggregationLevel: 'daily' as const,
  selectedMetrics: [],
};

export const useFilterStore = create<FilterState>((set) => ({
  ...defaultState,
  
  setDateRange: (start, end) => set({ startDate: start, endDate: end }),
  setSelectedFarms: (farms) => set({ selectedFarms: farms }),
  setSelectedPens: (pens) => set({ selectedPens: pens }),
  setSelectedBatches: (batches) => set({ selectedBatches: batches }),
  setShowOwnDataOnly: (show) => set({ showOwnDataOnly: show }),
  setAggregationLevel: (level) => set({ aggregationLevel: level }),
  setSelectedMetrics: (metrics) => set({ selectedMetrics: metrics }),
  resetFilters: () => set(defaultState),
}));