import {
  Paper,
  Title,
  ScrollArea,
  Table,
  Badge,
} from '@mantine/core';
import type { MortalityCategoryRate } from '../../types/loss_mortality_category_rate';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';

interface Props {
  mortalityCategoryRates: MortalityCategoryRate[];
  highlightedCategory?: string | null;
  onCategorySelect?: (categoryKey: string) => void;
}

dayjs.locale('nb');

const formatAndel = (num: number | null | undefined): string => {
  if (num == null) return '–';
  return `${(num * 100).toFixed(1)}%`;
};

const formatNoDecimals = (num: number | null | undefined): string => {
  if (num == null) return '–';
  return Math.round(num).toLocaleString('no-NO');
};

const formatPeriod = (period: string): string => {
  return dayjs(period).format('MMM YYYY');
};

export function MortalityCategoryRateTable({ mortalityCategoryRates }: Props) {
  return (
    <Paper p="md" radius="md" withBorder>
      <Title order={4} mb="md">
        Taps- og dødsårsaker rangert etter andel av totalt antall døde i perioden
      </Title>

      <ScrollArea type="always" h={700}>
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'var(--mantine-color-body)' }}>
            <Table.Tr>
              <Table.Th>Periode</Table.Th>
              <Table.Th>Kategori</Table.Th>
              <Table.Th>Årsaksnavn</Table.Th>
              <Table.Th>Alt. årsaksnavn</Table.Th>
              <Table.Th>Snittvekt (gram)</Table.Th>
              <Table.Th>Andel</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {[...mortalityCategoryRates]
              .sort((a, b) => new Date(b.period).getTime() - new Date(a.period).getTime())
              .map((mcr, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{formatPeriod(mcr.period)}</Table.Td>
                  <Table.Td>
                    <Badge color={mcr.loss_category_code} variant="light">
                      {mcr.loss_category_code}
                    </Badge>
                  </Table.Td>
                  <Table.Td
                    style={{
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {mcr.category_name}
                  </Table.Td>
                  <Table.Td>{mcr.category_short_name}</Table.Td>
                  <Table.Td>{formatNoDecimals(mcr.loss_avg_weight_gram)}</Table.Td>
                  <Table.Td>{formatAndel(mcr.loss_rate)}</Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}