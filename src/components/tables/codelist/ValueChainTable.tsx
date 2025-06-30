import { Table } from '@mantine/core';
import type { Codelist } from '../../../types/codelist';
import { BooleanBadge } from '../../BooleanBadge';

interface Props {
  codelist: Codelist[];
}


export const ValueChainCodelistTable = ({ codelist }: Props) => (
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
    