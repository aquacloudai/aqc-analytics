 export interface Site {
    site_id: string;
    site_name: string;
    latitude: number;
    longitude: number;
    placement: "offshore" | "onshore";
    production_area_id: number;
    production_area_name: string;
    marine_type_code: string | null;
    marine_type_name: string | null;
    marine_type_region_code: string | null;
    marine_type_region_name: string | null;
    is_in_aquacloud: boolean;  
 }