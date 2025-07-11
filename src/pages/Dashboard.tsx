import { Stack} from '@mantine/core';
import { useLossByRegion } from '../hooks/lossMortality/useLossByRegion';
import { LossByRegionOverview } from '../components/LossByRegionContainer';
import { TemperatureLineChart } from '../components/charts/TemperatureByWeekAndRegion';

export function Dashboard() {
  const { data: lossByRegion } = useLossByRegion();

  return (
    <Stack gap="lg">

      <LossByRegionOverview data={lossByRegion} />

      <TemperatureLineChart />

    </Stack>
  );
}
