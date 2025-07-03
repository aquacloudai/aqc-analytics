import api from '../auth/apiClient';
import type { AuthFarmer } from '../../types/auth_farmers';

export type Farmer = {
  id?: string;     
  name: string;
  short_name?: string;
  number_of_farmers_in_dataset?: number | null;
};

export async function fetchFarmer(): Promise<Farmer> {
  const res = await api.get('/v3/common/farmer/me');
  return res.data.data;  // <<--- Return only the .data part
}


export async function fetchAuthFarmers(): Promise<AuthFarmer[]> {
  const res = await api.get('/v3/admin/common/farmers-in-aquacloud');
  return res.data.data;  // <<--- Return only the .data part
}