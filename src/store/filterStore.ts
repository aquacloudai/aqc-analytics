import { create } from 'zustand';
import dayjs, { Dayjs } from 'dayjs';

interface FilterState {
  from_month: Dayjs | null;
  to_month: Dayjs | null;
  selectedArea: string | null;
  selectedGeneration: string | null;
  weightRangeStart: number;
  weightRangeEnd: number;
  include_self: boolean;
  searchTerm: string;
  selectedCategories: string[];

  applyFilters: boolean;
  triggerApplyFilters: () => void;

  // Setters
  setFromMonth: (start: Dayjs | null) => void;
  setToMonth: (end: Dayjs | null) => void;
  setSelectedArea: (area: string | null) => void;
  setSelectedUtsett: (utsett: string | null) => void;
  setWeightRangeStart: (value: number) => void;
  setWeightRangeEnd: (value: number) => void;
  setIncludeSelf: (show: boolean) => void;
  setSearchTerm: (term: string) => void;
  toggleCategory: (category: string) => void;
  resetFilters: () => void;
}

const defaultState = {
  from_month: dayjs('2024-05-01'),
  to_month: dayjs(),
  selectedArea: null,
  selectedGeneration: null,
  weightRangeStart: 0,
  weightRangeEnd: 10000,
  include_self: true,
  searchTerm: '',
  selectedCategories: [],
  applyFilters: false,
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...defaultState,


  setFromMonth: (start) => set({ from_month: start }),
  setToMonth: (end) => set({ to_month: end }),
  setSelectedArea: (area) => set({ selectedArea: area }),
  setSelectedUtsett: (generation) => set({ selectedGeneration: generation }),
  setWeightRangeStart: (value) => set({ weightRangeStart: value }),
  setWeightRangeEnd: (value) => set({ weightRangeEnd: value }),
  setIncludeSelf: (show) => set({ include_self: show }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  toggleCategory: (category) => {
    const { selectedCategories } = get();
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    set({ selectedCategories: updated });
  },
  resetFilters: () => set(defaultState),
  triggerApplyFilters: () => set((state) => ({ applyFilters: !state.applyFilters })),
}));
