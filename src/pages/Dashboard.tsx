import { Stack} from '@mantine/core';
import { useFarmers } from '../hooks/useFarmers';
import { useFarmAndSiteStats } from '../hooks/useFarmAndSiteStats';
import { useLossByRegion } from '../hooks/useLossByRegion';
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
