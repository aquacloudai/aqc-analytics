import { Title, Paper, Stack, Switch, Button, Group, TextInput, Select, Text } from '@mantine/core';
import { IconDeviceFloppy, IconUser, IconBell, IconPalette } from '@tabler/icons-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export function Settings() {
  const user = useAuthStore((state) => state.user);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  const handleSave = () => {
    // Save settings to backend
    console.log('Saving settings...');
  };

  return (
    <div>
      <Title order={1} mb="lg">Settings</Title>

      <Stack gap="lg">
        <Paper p="md" radius="md" withBorder>
          <Group mb="md">
            <IconUser size={20} />
            <Title order={3}>Profile</Title>
          </Group>
          <Stack>
            <TextInput
              label="Username"
              value={user?.username || ''}
              disabled
            />
            <TextInput
              label="Email"
              value={user?.email || ''}
              disabled
            />
            <Text size="sm" c="dimmed">
              Profile information is managed through Keycloak
            </Text>
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Group mb="md">
            <IconBell size={20} />
            <Title order={3}>Notifications</Title>
          </Group>
          <Stack>
            <Switch
              label="Email notifications"
              description="Receive alerts and reports via email"
              checked={notifications.email}
              onChange={(e) => setNotifications(prev => ({ ...prev, email: e.currentTarget.checked }))}
            />
            <Switch
              label="Push notifications"
              description="Browser push notifications for urgent alerts"
              checked={notifications.push}
              onChange={(e) => setNotifications(prev => ({ ...prev, push: e.currentTarget.checked }))}
            />
            <Switch
              label="SMS notifications"
              description="Critical alerts via SMS"
              checked={notifications.sms}
              onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.currentTarget.checked }))}
            />
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Group mb="md">
            <IconPalette size={20} />
            <Title order={3}>Appearance</Title>
          </Group>
          <Stack>
            <Select
              label="Theme"
              data={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'System' },
              ]}
              value={theme}
              onChange={(value) => setTheme(value || 'light')}
            />
            <Select
              label="Language"
              data={[
                { value: 'en', label: 'English' },
                { value: 'no', label: 'Norwegian' },
              ]}
              value={language}
              onChange={(value) => setLanguage(value || 'en')}
            />
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Title order={3} mb="md">Data Preferences</Title>
          <Stack>
            <Select
              label="Default Date Range"
              data={[
                { value: '7', label: 'Last 7 days' },
                { value: '30', label: 'Last 30 days' },
                { value: '90', label: 'Last 90 days' },
              ]}
              defaultValue="30"
            />
            <Select
              label="Default Chart Type"
              data={[
                { value: 'line', label: 'Line Chart' },
                { value: 'bar', label: 'Bar Chart' },
                { value: 'area', label: 'Area Chart' },
              ]}
              defaultValue="line"
            />
          </Stack>
        </Paper>

        <Group justify="flex-end">
          <Button 
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Group>
      </Stack>
    </div>
  );
}