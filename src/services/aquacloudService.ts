import api from './api';

export async function fetchFarmersInAquaCloud() {
  const response = await api.get('/v3/common/farmers-in-aquacloud');
  return response.data;
}

export async function fetchFarmAndSiteStats() {
  const response = await api.get('/v3/common/farm-and-site-stats');
  return response.data;
}

export async function fetchAquacloudFdirBiomassPerMonth() {
  const response = await api.get('/v3/inventory/aquacloud-fiskeridirektoratet-biomass-by-month');
  return response.data;
}