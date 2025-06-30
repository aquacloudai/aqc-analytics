import { Table } from '@mantine/core';
import type { Codelist } from '../../../types/codelist';
import { BooleanBadge } from '../../BooleanBadge';

interface Props {
  codelist: Codelist[];
}


export const CauseCodelistTable = ({ codelist }: Props) => (
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