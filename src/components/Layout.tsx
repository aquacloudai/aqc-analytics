import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppShell, Burger, Group, NavLink, Button, Avatar, Menu, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuthStore } from '../store/authStore';
import { 
  IconDashboard, 
  IconChartBar, 
  IconMap, 
  IconReport,
  IconSettings,
  IconLogout,
  IconUser,
  IconFilter
} from '@tabler/icons-react';

export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navigation = [
    { path: '/', label: 'Dashboard', icon: IconDashboard },
    { path: '/analytics', label: 'Analytics', icon: IconChartBar },
    { path: '/map', label: 'Farm Map', icon: IconMap },
    { path: '/reports', label: 'Reports', icon: IconReport },
    { path: '/filters', label: 'Data Filters', icon: IconFilter },
    { path: '/settings', label: 'Settings', icon: IconSettings },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="lg" fw={700}>AQC Analytics</Text>
          </Group>
          
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" p="xs">
                <Group gap="xs">
                  <Avatar size="sm" radius="xl">
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Text size="sm">{user?.username}</Text>
                </Group>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item leftSection={<IconUser size={16} />}>
                Profile
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} />}
                onClick={logout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                component={Link}
                to={item.path}
                label={item.label}
                leftSection={<Icon size={20} />}
                active={location.pathname === item.path}
                mb="xs"
              />
            );
          })}
        </AppShell.Section>
        
        {user?.farmerId && (
          <AppShell.Section>
            <Text size="xs" c="dimmed">
              Farmer ID: {user.farmerId}
            </Text>
          </AppShell.Section>
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}