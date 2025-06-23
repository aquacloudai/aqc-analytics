import { Title, Paper, Table, Button, Group, Badge, TextInput, Select } from '@mantine/core';
import { IconDownload, IconSearch, IconCalendar } from '@tabler/icons-react';
import { useState } from 'react';

export function Reports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState<string | null>(null);

  // Mock report data
  const reports = [
    {
      id: 1,
      name: 'Monthly Production Report - November 2024',
      type: 'production',
      date: '2024-11-30',
      size: '2.4 MB',
      status: 'ready',
    },
    {
      id: 2,
      name: 'Water Quality Analysis Q4 2024',
      type: 'environmental',
      date: '2024-11-28',
      size: '1.8 MB',
      status: 'ready',
    },
    {
      id: 3,
      name: 'Feed Efficiency Report - Week 48',
      type: 'feed',
      date: '2024-11-25',
      size: '1.2 MB',
      status: 'processing',
    },
    {
      id: 4,
      name: 'Mortality Analysis - November 2024',
      type: 'health',
      date: '2024-11-20',
      size: '3.1 MB',
      status: 'ready',
    },
  ];

  const reportTypes = [
    { value: 'production', label: 'Production Reports' },
    { value: 'environmental', label: 'Environmental Reports' },
    { value: 'feed', label: 'Feed Reports' },
    { value: 'health', label: 'Health Reports' },
  ];

  const getStatusColor = (status: string) => {
    return status === 'ready' ? 'green' : 'yellow';
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !reportType || report.type === reportType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <Title order={1} mb="lg">Reports</Title>

      <Paper p="md" radius="md" withBorder mb="lg">
        <Group>
          <TextInput
            placeholder="Search reports..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by type"
            data={reportTypes}
            value={reportType}
            onChange={setReportType}
            clearable
            w={200}
          />
          <Button leftSection={<IconCalendar size={16} />}>
            Generate New Report
          </Button>
        </Group>
      </Paper>

      <Paper radius="md" withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Report Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Size</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredReports.map((report) => (
              <Table.Tr key={report.id}>
                <Table.Td>{report.name}</Table.Td>
                <Table.Td>
                  <Badge variant="light">
                    {reportTypes.find(t => t.value === report.type)?.label}
                  </Badge>
                </Table.Td>
                <Table.Td>{report.date}</Table.Td>
                <Table.Td>{report.size}</Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    leftSection={<IconDownload size={14} />}
                    disabled={report.status !== 'ready'}
                  >
                    Download
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}