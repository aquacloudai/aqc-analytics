export interface Codelist {
    level_1_code: string;
    level_1_name: string;
    level_2_code: string;
    level_2_name: string;
    level_3_code: string;
    category_name: string;
    category_name_short: string;
    category_name_eng: string;
    category_name_short_eng: string;
    for_daily_registration: boolean | null;
    reporting_obligation: string;
    placement: {
        sea: boolean;
        land: boolean;
    };
    cause: {
        death: boolean;
        killed: boolean;
        downgrade: boolean;
    };
    value_chain: {
        roe: boolean;
        postsmolt: boolean;
        freshwater: boolean;
        brackish_or_sea_water: boolean;
        harvest_facility: boolean;
    };
    species: {
        salmon: boolean;
        cleanerfish: boolean;
        rainbow_trout: boolean;
    };
    last_modified: string; // ISO date string
}