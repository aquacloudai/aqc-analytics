import api from '../auth/apiClient';

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
