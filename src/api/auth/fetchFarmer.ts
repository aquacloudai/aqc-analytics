import api from '../auth/apiClient';
import type { AuthFarmer } from '../../types/auth_farmers';
import type { Farmer } from '../../types/farmer';

export async function fetchFarmer(): Promise<Farmer> {
  const res = await api.get('/v3/common/farmer/me');
  return res.data.data as Farmer;
}
export async function fetchFarmers(): Promise<Farmer[]> {
  const res = await api.get('/v3/common/farmers-in-aquacloud');
  const data = res.data.data;
  // DEBUG log
  console.log("[fetchFarmers] data:", data);
  if (Array.isArray(data)) {
    console.log("[fetchFarmers] RETURN ARRAY");
    return data;
  }
  if (data && Array.isArray(data.items)) {
    console.log("[fetchFarmers] RETURN data.items");
    return data.items;
  }
  console.log("[fetchFarmers] RETURN []");
  return [];
}



export async function fetchAuthFarmers(): Promise<AuthFarmer[]> {
  const res = await api.get('/v3/admin/common/farmers-in-aquacloud');
  return Array.isArray(res.data.data) ? res.data.data : [];
}
