import {
  Paper,
  Title,
  ScrollArea,
  Table,
  Badge,
} from '@mantine/core';
import type { MortalityCategoryRate } from '../../types/loss_mortality_category_rate';

interface Props {
  mortalityCategoryRates: MortalityCategoryRate[];
}




export function MortalityCategoryRateTable({ mortalityCategoryRates }: Props) {
  return (
    <Paper p="md" radius="md" withBorder>
      <Title order={4} mb="md">Taps- og dødsårsaker rangert etter andel av totalt antall døde i perioden</Title>
      <ScrollArea h={300}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Periode</Table.Th>
              <Table.Th>Årsaksnavn</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mortalityCategoryRates.map((mcr, index) => (
              <Table.Tr key={index}>
                <Table.Td>{mcr.period}</Table.Td>
                <Table.Td>{mcr.category_name}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
