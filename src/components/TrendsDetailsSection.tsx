import { Stack, Title, Text, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export function TrendsDetailsSection() {
  return (
    <Stack gap="lg">
      <Title order={2}>Årsaksdetaljer</Title>
      <Alert color="blue" icon={<IconInfoCircle size="1rem" />}>
        Her kommer detaljerte grafer/tabeller for dødelighet etter antall og biomasse.
      </Alert>
      {/* TODO: Add charts, config, etc. */}
    </Stack>
  );
}
