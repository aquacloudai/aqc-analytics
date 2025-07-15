import { Stack, Button, Group, Title } from '@mantine/core';
import { useState } from 'react';
import { TrendsCategorySection } from '../components/TrendsCategorySection';
import { TrendsDetailsSection } from '../components/TrendsDetailsSection';
import { TrendsBySizeSection } from '../components/TrendsBySizeSection';

import { IconDownload, IconInfoCircle, IconRefresh } from '@tabler/icons-react';
// ... import your section components

export function Trends() {
  const [section, setSection] = useState<'category' | 'details' | 'size'>('category');
  // ...your logic for button disables/loading etc.

  return (
    <Stack gap="md">
              <Title order={1} mt="sm">
        Dødelighetstrender
      </Title>
      <Group justify="space-between" align="flex-end" mt="md">
        
        <Group gap="xs">
          <Button
            variant={section === 'category' ? 'filled' : 'light'}
            onClick={() => setSection('category')}
            radius="xl"
          >
            Årsakstrender
          </Button>
          <Button
            variant={section === 'details' ? 'filled' : 'light'}
            onClick={() => setSection('details')}
            radius="xl"
          >
            Årsaksdetaljer
          </Button>
          <Button
            variant={section === 'size' ? 'filled' : 'light'}
            onClick={() => setSection('size')}
            radius="xl"
          >
            Årsak / størrelse
          </Button>
        </Group>
        <Group gap="xs">
          <Button
            leftSection={<IconRefresh size="1rem" />}
            variant="light"
            // onClick={...}
          >
            Oppdater data
          </Button>
          <Button
            leftSection={<IconDownload size="1rem" />}
            variant="light"
            // onClick={...}
          >
            Last ned CSV
          </Button>
          <Button
            leftSection={<IconInfoCircle size="1rem" />}
            variant="light"
            // onClick={...}
          >
            Vis API-kall
          </Button>
        </Group>
      </Group>

      {section === 'category' && <TrendsCategorySection />}
      {section === 'details' && <TrendsDetailsSection />}
      {section === 'size' && <TrendsBySizeSection />}
    </Stack>
  );
}
