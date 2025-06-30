import type { MortalityCategoryRate } from '../types/loss_mortality_category_rate';
import type { Codelist } from '../types/codelist';

export const formatPeriod = (period: string): string => {
  const [year, month] = period.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const downloadChartData = (data: MortalityCategoryRate[], filename = 'mortality_trends.csv') => {
  const headers = [
    'Periode', 'Kategori kode', 'Kategori navn', 'Kategori kort navn', 'Level 1 kategori',
    'Tap antall', 'Dødelighet antall', 'Utkasting antall',
    'Tap rate (%)', 'Dødelighet rate (%)', 'Utkasting rate (%)',
    'Gjennomsnittlig vekt tap (g)', 'Gjennomsnittlig vekt død (g)', 'Gjennomsnittlig vekt utkastet (g)'
  ];

  const csvRows = data.map(item => [
    formatPeriod(item.period),
    item.loss_category_code,
    item.category_name,
    item.category_short_name,
    item.category_level_1_name,
    item.loss_count.toString(),
    item.mortality_count.toString(),
    item.culling_count.toString(),
    item.loss_rate.toFixed(2),
    item.mortality_rate.toFixed(2),
    item.culling_rate.toFixed(2),
    item.loss_avg_weight_gram.toString(),
    item.mortality_avg_weight_gram.toString(),
    (item.culling_avg_weight_gram || 0).toString()
  ]);

  const csvContent = [headers, ...csvRows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};


// Helper function to download CSV
export const downloadCodelist = (data: Codelist[], filename: string = 'kodeliste.csv') => {
  // Define headers
  const headers = [
    'Kode',
    'Navn',
    'Navn (kort)',
    'Nivå 1',
    'Nivå 2',
    'I sjø',
    'På land',
    'Avlingsårsak',
    'Dødsårsak',
    'Nedgradering',
    'Rogn',
    'Postsmolt',
    'Ferskvann',
    'Slakteri',
    'Brakk- eller sjøvann',
    'Laks',
    'Ørret',
    'Rensefisk'
  ];

  // Convert data to CSV rows
  const csvRows = data.map(code => [
    code.level_3_code || '',
    code.category_name || '',
    code.category_name_short || '',
    code.level_1_code || '',
    code.level_2_code || '',
    code.placement?.sea ? 'Ja' : 'Nei',
    code.placement?.land ? 'Ja' : 'Nei',
    code.cause?.killed ? 'Ja' : 'Nei',
    code.cause?.death ? 'Ja' : 'Nei',
    code.cause?.downgrade ? 'Ja' : 'Nei',
    code.value_chain?.roe ? 'Ja' : 'Nei',
    code.value_chain?.postsmolt ? 'Ja' : 'Nei',
    code.value_chain?.freshwater ? 'Ja' : 'Nei',
    code.value_chain?.harvest_facility ? 'Ja' : 'Nei',
    code.value_chain?.brackish_or_sea_water ? 'Ja' : 'Nei',
    code.species?.salmon ? 'Ja' : 'Nei',
    code.species?.rainbow_trout ? 'Ja' : 'Nei',
    code.species?.cleanerfish ? 'Ja' : 'Nei'
  ]);

  // Combine headers and data
  const csvContent = [headers, ...csvRows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};