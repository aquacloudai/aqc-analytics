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




export function FarmersInAquaCloudTable({ farmers }: Props) {
  return (
    <Paper p="md" radius="md" withBorder>
      <Title order={4} mb="md">Farmers in AquaCloud</Title>
      <ScrollArea h={300}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Region(s)</Table.Th>
              <Table.Th>PO</Table.Th>
              <Table.Th>Active</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {farmers.map((farmer, index) => (
              <Table.Tr key={index}>
                <Table.Td>{farmer.name}</Table.Td>
                <Table.Td>{farmer.region}</Table.Td>
                <Table.Td>{farmer.po}</Table.Td>
                <Table.Td>
                  <Badge
                    color={farmer.active ? 'green' : 'red'}
                    size="sm"
                    variant="light"
                  >
                    {farmer.active ? '✓' : '✗'}
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
