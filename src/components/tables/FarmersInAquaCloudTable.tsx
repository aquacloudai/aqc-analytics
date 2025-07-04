import {
  Paper,
  Title,
  ScrollArea,
  Table,
  Badge,
} from '@mantine/core';
import type { Farmer } from '../../types/farmer';

interface Props {
  farmers: Farmer[];
}



export function FarmersInAquaCloudTable({ farmers = [] }: Props) {

  return (
    <Paper p="md" radius="md" withBorder>
      <Title order={4} mb="md">Oppdrettere i AquaCloud</Title>
      <ScrollArea h={300}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Navn</Table.Th>
              <Table.Th>Region(er)</Table.Th>
              <Table.Th>PO</Table.Th>
              <Table.Th>Aktiv</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {(farmers).map((farmer, index) => (
              <Table.Tr key={index}>
                <Table.Td>{farmer.name}</Table.Td>
                {/* TODO: Fill in Region(er) and PO, as needed */}
                <Table.Td>-</Table.Td>
                <Table.Td>-</Table.Td>
                <Table.Td>
                  <Badge
                    color={farmer.is_active_with_data ? 'green' : 'red'}
                    size="sm"
                    variant="light"
                  >
                    {farmer.is_active_with_data ? '✓' : '✗'}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}

