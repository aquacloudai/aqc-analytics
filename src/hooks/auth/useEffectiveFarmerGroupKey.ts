import { useAuthStore } from '../../store/authStore';
import { useAdminFarmerStore } from '../../store/adminFarmerStore';

export function useEffectiveFarmerGroupKey() {
  const { user } = useAuthStore();
  const { selectedFarmer } = useAdminFarmerStore();

  // If admin and has selected a farmer, use that
  if (user?.roles.includes('aqc-admin') && selectedFarmer) {
    return selectedFarmer;
  }
  // Otherwise, for regular user, always use keycloak's farmer_group_key
  return user?.farmer_group_key || null;
}
