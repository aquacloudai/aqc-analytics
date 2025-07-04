import { create } from 'zustand';

interface AdminFarmerStore {
  selectedFarmer: string | null; // or AuthFarmer if you want full object
  setSelectedFarmer: (farmerGroupKey: string | null) => void;
  clearSelectedFarmer: () => void;
}

export const useAdminFarmerStore = create<AdminFarmerStore>((set) => ({
  selectedFarmer: null,
  setSelectedFarmer: (farmerGroupKey) => set({ selectedFarmer: farmerGroupKey }),
  clearSelectedFarmer: () => set({ selectedFarmer: null }),
}));
