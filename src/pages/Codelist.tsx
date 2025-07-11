import {
  Title, Paper, Tabs, Text, Loader, Alert, ScrollArea, Group, Stack, Button, TextInput
} from '@mantine/core';
import { useState, useMemo } from 'react';
import { IconAlertCircle, IconDownload, IconSearch, IconInfoCircle } from '@tabler/icons-react';
import { downloadCodelist } from '../utils/downloadCSV';
import { useCodelist } from '../hooks/common/useCodelist';
import { CauseCodelistTable } from '../components/tables/codelist/CauseCodelistTable';
import { BasicCodelistTable } from '../components/tables/codelist/CodelistTable';
import { PlacementCodelistTable } from '../components/tables/codelist/PlacementCodelistTable';
import { SpeciesCodelistTable } from '../components/tables/codelist/SpeciesCodelistTable';
import { ValueChainCodelistTable } from '../components/tables/codelist/ValueChainTable';
import type { Codelist } from '../types/codelist';
import { ApiInfoModal } from "../components/ApiInfoModal";

export function Codelist() {
  const [activeTab, setActiveTab] = useState<string | null>('basic');
  const [search, setSearch] = useState('');
  const { data: codelist, loading, error, apiDetails } = useCodelist();
  const [showApiModal, setShowApiModal] = useState(false);

  // Filter logic
  const filteredCodelist = useMemo(() => {
    if (!search.trim()) return codelist;
    const query = search.toLowerCase();
    return codelist.filter((item: Codelist) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  }, [codelist, search]);

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
      <Alert icon={<IconAlertCircle size="1rem" />} title="Feil" color="red" mt="lg">
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <Group justify="space-between" align="flex-end" mb="md">
        <div>
          <Title order={1}>
            Kodeliste
            {codelist.length > 0 && (
              <Text size="sm" c="dimmed" component="span" ml="sm">
                ({filteredCodelist.length} av {codelist.length})
              </Text>
            )}
          </Title>
          <Text size="m" c="dimmed" mt="xs">
            Taps- og dødsårsaker
          </Text>
        </div>

        <Group gap="sm">
          <TextInput
            placeholder="Søk i koder"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          {codelist.length > 0 && (
            <>
              <Button
                leftSection={<IconDownload size="1rem" />}
                variant="light"
                onClick={() => downloadCodelist(filteredCodelist)}
              >
                Last ned CSV
              </Button>
              <Button
                leftSection={<IconInfoCircle size="1rem" />}
                variant="light"
                onClick={() => setShowApiModal(true)}
              >
                Vis API-kall
              </Button>
            </>
          )}
        </Group>
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
              <BasicCodelistTable codelist={filteredCodelist} />
            </Tabs.Panel>
            <Tabs.Panel value="placement">
              <PlacementCodelistTable codelist={filteredCodelist} />
            </Tabs.Panel>
            <Tabs.Panel value="cause">
              <CauseCodelistTable codelist={filteredCodelist} />
            </Tabs.Panel>
            <Tabs.Panel value="valuechain">
              <ValueChainCodelistTable codelist={filteredCodelist} />
            </Tabs.Panel>
            <Tabs.Panel value="species">
              <SpeciesCodelistTable codelist={filteredCodelist} />
            </Tabs.Panel>
          </ScrollArea>
        </Tabs>
      </Paper>

      <ApiInfoModal
        opened={showApiModal}
        onClose={() => setShowApiModal(false)}
        apiDetails={[apiDetails]}
      />
    </div>
  );
}
