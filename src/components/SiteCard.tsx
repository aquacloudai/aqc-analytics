// components/SiteCard.tsx
import { Card, Text, Badge, Group, Stack } from '@mantine/core';
import { IconMap, IconMapPin } from '@tabler/icons-react';
import type { Site } from '../types/site';
import { Link } from 'react-router-dom';

interface Props {
  site: Site;
}

export function SiteCard({ site }: Props) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder component={Link} to={`/sites/${site.site_id}`}>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw={600}>{site.site_name}</Text>
          {site.is_in_aquacloud && <Badge color="blue" variant="light">AquaCloud</Badge>}
        </Group>

        <Group>
        <IconMap size={14} />
        <Text size="sm" c="dimmed">
          {site.production_area_name} 
        </Text>
        </Group>

        {site.marine_type_name && (
          <Text size="xs" c="gray">
            {site.marine_type_region_name} / {site.marine_type_name}
          </Text>
        )}

        <Group gap="xs">
          <IconMapPin size={14} />
          <Text size="xs" c="dimmed">
            {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
