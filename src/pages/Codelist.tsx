import { Title, Paper, Tabs, Text, Loader, Alert, ScrollArea, Group, Stack, Button } from '@mantine/core';
import { useState } from 'react';
import { IconAlertCircle, IconDownload } from '@tabler/icons-react';
import type { Codelist } from '../types/codelist';
import { downloadCodelist } from '../utils/downloadCSV';
import { useCodelist } from '../hooks/useCodelist';
import { CauseCodelistTable } from '../components/tables/codelist/CauseCodelistTable';
import { BasicCodelistTable } from '../components/tables/codelist/CodelistTable';
import { PlacementCodelistTable } from '../components/tables/codelist/PlacementCodelistTable';
import { SpeciesCodelistTable } from '../components/tables/codelist/SpeciesCodelistTable';
import { ValueChainCodelistTable } from '../components/tables/codelist/ValueChainTable';


export function Codelist() {
  const [activeTab, setActiveTab] = useState<string | null>('basic');
  const { data: codelist, loading, error } = useCodelist();



  if (loading) {
    return (
      <Stack align="center" mt="xl">
        <Loader size="lg" />
        <Text>Laster kodeliste...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert 
        icon={<IconAlertCircle size="1rem" />} 
        title="Feil" 
        color="red"
        mt="lg"
      >
        {error}
      </Alert>
    );
  }



  return (
    <div>
      <Group justify="space-between" align="flex-end" mb="lg">
        <div>
          <Title order={1}>
            Kodelist
            {codelist.length > 0 && (
              <Text size="sm" c="dimmed" component="span" ml="sm">
                ({codelist.length} koder)
              </Text>
            )}
          </Title>
          <Text size="m" c="dimmed" mt="xs">
            Taps- og dødsårsaker
          </Text>
        </div>

        {codelist.length > 0 && (
          <Button
            leftSection={<IconDownload size="1rem" />}
            variant="light"
            onClick={() => downloadCodelist(codelist)}
          >
            Last ned CSV
          </Button>
        )}
      </Group>
      <Paper shadow="sm" p="md">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="basic">Grunnleggende</Tabs.Tab>
            <Tabs.Tab value="placement">Plassering</Tabs.Tab>
            <Tabs.Tab value="cause">Årsak</Tabs.Tab>
            <Tabs.Tab value="valuechain">Verdikjede</Tabs.Tab>
            <Tabs.Tab value="species">Arter</Tabs.Tab>
          </Tabs.List>

          <ScrollArea mt="md">
            <Tabs.Panel value="basic">
              <BasicCodelistTable codelist={codelist}/>
            </Tabs.Panel>

            <Tabs.Panel value="placement">
              <PlacementCodelistTable codelist={codelist}/>
            </Tabs.Panel>

            <Tabs.Panel value="cause">
              <CauseCodelistTable codelist={codelist}/>
            </Tabs.Panel>

            <Tabs.Panel value="valuechain">
              <ValueChainCodelistTable codelist={codelist}/>
            </Tabs.Panel>

            <Tabs.Panel value="species">
            <SpeciesCodelistTable codelist={codelist}/>
            </Tabs.Panel>
          </ScrollArea>
        </Tabs>
      </Paper>
    </div>
  );
}