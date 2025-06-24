export interface TemperatureTrendData {
    idx: number;
    area_name: string;
    group: string;
    week: string;
    weeknum: number;
    year: number;
    temperature: number;
    trend: number;
    change: number;
    macro_trend: number;
    macro_change: number;
    macro_change_2: number;
    prev_year: number;
    prev_year_2: number;
}