import { Title, Paper, Tabs, Table, Text, Badge, Loader, Alert, ScrollArea, Group, Stack, Button } from '@mantine/core';
import { useState, useEffect } from 'react';
import api from '../api/auth/apiClient';
import { isKeycloakReady } from '../config/keycloak';
import { IconAlertCircle, IconDownload } from '@tabler/icons-react';
import type { Codelist } from '../types/codelist';


// Helper function to download CSV
const downloadCSV = (data: Codelist[], filename: string = 'kodelist.csv') => {
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

// Helper component for boolean badges
const BooleanBadge = ({ value, label }: { value: boolean; label?: string }) => (
  <Badge 
    color={value ? 'green' : 'red'} 
    size="sm" 
    variant="light"
    title={label}
  >
    {value ? 'Ja' : 'Nei'}
  </Badge>
);

export function Codelist() {
  const [codelist, setCodelist] = useState<Codelist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('basic');

  useEffect(() => {
    if (!isKeycloakReady()) return;

    const fetchCodelist = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get<{ data: Codelist[] }>('/v2/mortality/categories/codelist');
        setCodelist(response.data?.data || []);
      } catch (error) {
        console.error('[Dashboard] Failed to fetch codelist:', error);
        setError('Kunne ikke laste kodelist. Vennligst prøv igjen.');
      } finally {
        setLoading(false);
      }
    };

    fetchCodelist();
  }, []);

  if (loading) {
    return (
      <Stack align="center" mt="xl">
        <Loader size="lg" />
        <Text>Laster kodelist...</Text>
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

  const renderBasicTable = () => (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Kode</Table.Th>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Navn (kort)</Table.Th>
          <Table.Th>Nivå 1</Table.Th>
          <Table.Th>Nivå 2</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {codelist.map((code, index) => (
          <Table.Tr key={code.level_3_code || index}>
            <Table.Td>{code.level_3_code}</Table.Td>
            <Table.Td>{code.category_name}</Table.Td>
            <Table.Td>{code.category_name_short}</Table.Td>
            <Table.Td>{code.level_1_code}</Table.Td>
            <Table.Td>{code.level_2_code}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );

  const renderPlacementTable = () => (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Kode</Table.Th>
          <Table.Th>Navn</Table.Th>
          <Table.Th>I sjø</Table.Th>
          <Table.Th>På land</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {codelist.map((code, index) => (
          <Table.Tr key={code.level_3_code || index}>
            <Table.Td>{code.level_3_code}</Table.Td>
            <Table.Td>{code.category_name}</Table.Td>
            <Table.Td>
              <BooleanBadge value={code.placement?.sea} label="I sjø" />
            </Table.Td>
            <Table.Td>
              <BooleanBadge value={code.placement?.land} label="På land" />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );

  const renderCauseTable = () => (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Kode</Table.Th>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Avlingsårsak</Table.Th>
          <Table.Th>Dødsårsak</Table.Th>
          <Table.Th>Nedgradering</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {codelist.map((code, index) => (
          <Table.Tr key={code.level_3_code || index}>
            <Table.Td>{code.level_3_code}</Table.Td>
            <Table.Td>{code.category_name}</Table.Td>
            <Table.Td>
              <BooleanBadge value={code.cause?.killed} label="Avlingsårsak" />
            </Table.Td>
            <Table.Td>
              <BooleanBadge value={code.cause?.death} label="Dødsårsak" />
            </Table.Td>
            <Table.Td>
              <BooleanBadge value={code.cause?.downgrade} label="Nedgradering" />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );

  const renderValueChainTable = () => (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Kode</Table.Th>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Rogn</Table.Th>
          <Table.Th>Postsmolt</Table.Th>
          <Table.Th>Ferskvann</Table.Th>
          <Table.Th>Slakteri</Table.Th>
          <Table.Th>Brakk-/sjøvann</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {codelist.map((code, index) => (
          <Table.Tr key={code.level_3_code || index}>
            <Table.Td>{code.level_3_code}</Table.Td>
            <Table.Td>{code.category_name}</Table.Td>
            <Table.Td>
              <BooleanBadge value={code.value_chain?.roe} label="Rogn" />
            </Table.Td>
            <Table.Td>
              <BooleanBadge value={code.value_chain?.postsmolt} label="Postsmolt" />
            </Table.Td>
            <Table.Td>
              <BooleanBadge value={code.value_chain?.freshwater} label="Ferskvann" />
            </Table.Td>
            <Table.Td>
              <BooleanBadge value={code.value_chain?.harvest_facility} label="Slakteri" />
            </Table.Td>
            <Table.Td>
              <BooleanBadge value={code.value_chain?.brackish_or_sea_water} label="Brakk- eller sjøvann" />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );

  const renderSpeciesTable = () => (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Kode</Table.Th>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Laks</Table.Th>
          <Table.Th>Ørret</Table.Th>
          <Table.Th>Rensefisk</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {codelist.map((code, index) => (
          <Table.Tr key={code.level_3_code || index}>
            <Table.Td>{code.level_3_code}</Table.Td>
            <Table.Td>{code.category_name}</Table.Td>
            <Table.Td>
              <BooleanBadge value={code.species?.salmon} label="Laks" />
            </Table.Td>
            <Table.Td>
              <BooleanBadge value={code.species?.rainbow_trout} label="Ørret" />
            </Table.Td>
            <Table.Td>
              <BooleanBadge value={code.species?.cleanerfish} label="Rensefisk" />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );

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
            onClick={() => downloadCSV(codelist)}
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
              {renderBasicTable()}
            </Tabs.Panel>

            <Tabs.Panel value="placement">
              {renderPlacementTable()}
            </Tabs.Panel>

            <Tabs.Panel value="cause">
              {renderCauseTable()}
            </Tabs.Panel>

            <Tabs.Panel value="valuechain">
              {renderValueChainTable()}
            </Tabs.Panel>

            <Tabs.Panel value="species">
              {renderSpeciesTable()}
            </Tabs.Panel>
          </ScrollArea>
        </Tabs>
      </Paper>
    </div>
  );
}