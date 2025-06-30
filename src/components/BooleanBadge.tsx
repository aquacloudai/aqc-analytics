import { Badge } from '@mantine/core';

interface BooleanBadgeProps {
  value: boolean;
  label?: string;
}

export const BooleanBadge = ({ value, label }: BooleanBadgeProps) => (
  <Badge
    color={value ? 'green' : 'red'}
    size="sm"
    variant="light"
    title={label}
  >
    {value ? 'Ja' : 'Nei'}
  </Badge>
);
