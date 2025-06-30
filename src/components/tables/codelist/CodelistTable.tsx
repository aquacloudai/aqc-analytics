import { Table } from '@mantine/core';
import type { Codelist } from '../../../types/codelist';

interface Props {
  codelist: Codelist[];
}

export const BasicCodelistTable = ({ codelist }: Props) => (
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
