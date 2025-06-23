import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppShell, Burger, Group, NavLink, Button, Avatar, Menu, Text, ActionIcon, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../contexts/ThemeContext';
import { 
  IconDashboard, 
  IconChartBar, 
  IconMap, 
  IconReport,
  IconSettings,
  IconLogout,
  IconUser,
  IconFilter,
  IconSun,
  IconMoon
} from '@tabler/icons-react';

export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { colorScheme, toggleColorScheme } = useTheme();

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
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        header: {
          backgroundColor: colorScheme === 'dark' ? '#081a26' : '#014059',
          borderBottom: 'none',
        },
        navbar: {
          backgroundColor: colorScheme === 'dark' ? '#081a26' : '#014059',
          borderRight: 'none',
        }
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger 
              opened={opened} 
              onClick={toggle} 
              hiddenFrom="sm" 
              size="sm"
              color={colorScheme === 'dark' ? '#90d0d7' : '#ffffff'}
            />
            <Group gap="sm">
              <Image
                src={colorScheme === 'dark' ? '/logo_white.png' : '/logo_white.png'}
                alt="AquaCloud"
                h={32}
                w="auto"
              />
              <Text size="xl" fw={700} c={colorScheme === 'dark' ? '#90d0d7' : '#ffffff'}>
                AquaCloud
              </Text>
            </Group>
          </Group>
          
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              onClick={toggleColorScheme}
              size="lg"
              color={colorScheme === 'dark' ? '#90d0d7' : '#ffffff'}
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
            
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="subtle" p="xs" color={colorScheme === 'dark' ? '#90d0d7' : '#ffffff'}>
                  <Group gap="xs">
                    <Avatar size="sm" radius="xl" color="dark-teal">
                      {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Text size="sm" c={colorScheme === 'dark' ? '#90d0d7' : '#ffffff'}>
                      {user?.username}
                    </Text>
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
                styles={{
                  root: {
                    color: colorScheme === 'dark' ? '#90d0d7' : '#ffffff',
                    '&[data-active]': {
                      backgroundColor: colorScheme === 'dark' ? '#014059' : '#90d0d7',
                      color: colorScheme === 'dark' ? '#90d0d7' : '#014059',
                    },
                    '&:hover': {
                      backgroundColor: colorScheme === 'dark' ? '#014059' : 'rgba(144, 208, 215, 0.1)',
                    }
                  }
                }}
              />
            );
          })}
        </AppShell.Section>
        
        {user?.farmerId && (
          <AppShell.Section>
            <Text size="xs" c={colorScheme === 'dark' ? '#90d0d7' : '#ffffff'} style={{ opacity: 0.7 }}>
              Demo - Farmer ID: {user.farmerId}
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