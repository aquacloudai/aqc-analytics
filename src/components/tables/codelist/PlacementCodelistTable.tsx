import { Table } from '@mantine/core';
import type { Codelist } from '../../../types/codelist';
import { BooleanBadge } from '../../BooleanBadge';

interface Props {
  codelist: Codelist[];
}

export const PlacementCodelistTable = ({ codelist }: Props) => (    <Table striped highlightOnHover>
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