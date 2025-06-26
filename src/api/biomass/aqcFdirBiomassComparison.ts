import api from '../auth/apiClient';
import type { AquacloudFdirBiomassPerMonth } from '../../types/aquacloud_fdir_biomass_per_month';

export async function getAqcFdirBiomassPerMonth(params: {
  fromMonth?: string;
  toMonth?: string;
}): Promise<AquacloudFdirBiomassPerMonth[]> {
  const response = await api.get<{ data: AquacloudFdirBiomassPerMonth[] }>(
    '/v3/inventory/aquacloud-fiskeridirektoratet-biomass-by-month',
    {
      params: {
        ...(params.fromMonth && { from_month: `${params.fromMonth}-01` }),
        ...(params.toMonth && { to_month: `${params.toMonth}-01` }),
      },
    }
  );

  return response.data.data || [];
}
