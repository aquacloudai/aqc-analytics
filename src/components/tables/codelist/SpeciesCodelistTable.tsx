import { Table } from '@mantine/core';
import type { Codelist } from '../../../types/codelist';
import { BooleanBadge } from '../../BooleanBadge';

interface Props {
  codelist: Codelist[];
}


export const SpeciesCodelistTable = ({ codelist }: Props) => (
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