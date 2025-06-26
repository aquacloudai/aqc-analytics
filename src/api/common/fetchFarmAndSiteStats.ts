import api from '../auth/apiClient';
import type { FarmAndSiteStats } from '../../types/farm_and_site_stats';

export const fetchFarmAndSiteStats = async (): Promise<FarmAndSiteStats> => {
  const res = await api.get<{ data: FarmAndSiteStats }>('/v3/common/farm-and-site-stats');
  return res.data?.data ?? {
    signed_farmers: 0,
    active_farmers: 0,
    offshore_sites: 0,
    onshore_sites: 0,
    recently_active_sites: 0,
  };
};
