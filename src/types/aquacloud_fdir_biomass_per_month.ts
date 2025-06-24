export interface AquacloudFdirBiomassPerMonth {
  month: string; // ISO date string, e.g., "2025-04-01"
  production_area_id: number;
  production_region_name: string;
  species_code: string;
  aquacloud_biomass_in_tons: number | null;
  fiskeridirektoratet_biomass_in_tons: number;
  aquacloud_biomass_coverage: number | null;
}
