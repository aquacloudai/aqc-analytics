import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppShell, Burger, Group, NavLink, Button, Avatar, Menu, Text, Image } from '@mantine/core';
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
  IconTemperature,
  IconBug,
  IconBuildingFactory,
  IconInfoCircle,
  IconPin
} from '@tabler/icons-react';
import { FilterSidebar } from './FilterSidebar';
import { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import logo from '../assets/logo.png';
import { useFarmer } from '../hooks/useFarmer';
import { Select } from '@mantine/core';
import { useAdminFarmers } from '../hooks/useAdminFarmers';
import { useAdminFarmerStore } from '../store/adminFarmerStore';

export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { data: farmer, loading: farmerLoading, error: farmerError } = useFarmer();
  const isAdmin = user?.roles.includes('aqc-admin');

  const { data: farmers, loading: farmersLoading, error: farmersError } = useAdminFarmers();

  const { selectedFarmer, setSelectedFarmer, clearSelectedFarmer } = useAdminFarmerStore();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


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
            <Group gap="xs">
              <Image src={logo} alt="AquaCloud Logo" height={50} />
            </Group>

          </Group>


          <Menu shadow="md" width={220}>
            <Menu.Target>
              <Button
                variant="subtle"
                p="xs"
                style={{
                  height: '100%',
                  minWidth: 170,
                  maxWidth: 240,
                  paddingLeft: 8,
                  paddingRight: 8,
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Avatar size="sm" radius="xl" style={{ flexShrink: 0, marginRight: 8 }}>
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,   // so ellipsis works
                    flex: 1,
                    height: '100%'
                  }}>
                    <Text
                      size="sm"
                      fw={600}
                      c="dark"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {user?.username}
                    </Text>
                    {farmerLoading ? (
                      <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Henter oppdretter...
                      </Text>
                    ) : farmerError ? (
                      <Text size="xs" c="red" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {farmerError}
                      </Text>
                    ) : farmer?.name ? (
                      <Text
                        size="xs"
                        c="dimmed"
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {farmer.name}
                      </Text>
                    ) : null}
                  </div>
                </div>
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
          {/* FishHealth dropdown manually declared */}
          <NavLink
            label="Dashboard"
            leftSection={<IconDashboard size={20} />}
            component={Link}
            active={location.pathname === '/'}
            to="/"
            mb="xs"
          />
          <NavLink
            label="Fiskehelse & Velferd"
            leftSection={<IconChartBar size={20} />}
            childrenOffset={16}
            defaultOpened={location.pathname.startsWith('/fishhealth')}
            mb="xs"
          >
            <NavLink
              component={Link}
              to="/fishhealth/overview"
              label="Oversikt"
              active={location.pathname === '/fishhealth/overview'}
              style={{
                opacity: 0.5,
              }}
            />
            <NavLink
              component={Link}
              to="/fishhealth/benchmark"
              label="Benchmark"
              active={location.pathname === '/fishhealth/benchmark'}
            />
            <NavLink
              component={Link}
              to="/fishhealth/trend"
              label="Trender"
              active={location.pathname === '/fishhealth/trend'}
            />
            <NavLink
              component={Link}
              to="/fishhealth/handling"
              label="Håndtering"
              active={location.pathname === '/fishhealth/handling'}
              style={{
                opacity: 0.5,
              }}
            />
            <NavLink
              component={Link}
              to="/fishhealth/codelist"
              label="Kodeliste"
              active={location.pathname === '/fishhealth/codelist'}
            />
          </NavLink>
          <NavLink
            label="Produksjon"
            leftSection={<IconBuildingFactory size={20} />}
            childrenOffset={16}
            defaultOpened={location.pathname.startsWith('/production')}
            mb="xs"
            style={{
              opacity: 0.5,
            }}
          >
            <NavLink
              component={Link}
              to="/production/sfr"
              label="Utforing/SFR"
              active={location.pathname === '/production/sfr'}
              style={{
                opacity: 0.5,
              }}
            />
          </NavLink>
          <NavLink
            label="Lus (under utvikling)"
            leftSection={<IconBug size={20} />}
            component={Link}
            active={location.pathname === '/lice'}
            to="/lice"
            mb="xs"
            style={{
              opacity: 0.5,
            }}
          />
          <NavLink
            label="Temperature"
            leftSection={<IconTemperature size={20} />}
            component={Link}
            active={location.pathname === '/temperature'}
            to="/temperature"
            mb="xs"
          />
          <NavLink
            label="Farm Map"
            leftSection={<IconMap size={20} />}
            component={Link}
            active={location.pathname === '/map'}
            to="/map"
            mb="xs"
          />
          <NavLink
            label="Sites"
            leftSection={<IconPin size={20} />}
            component={Link}
            active={location.pathname === '/sites'}
            to="/sites"
            mb="xs"
          />
          <NavLink
            label="Reports"
            leftSection={<IconReport size={20} />}
            component={Link}
            active={location.pathname === '/reports'}
            to="/reports"
            mb="xs"
          />
          <NavLink
            label="Om AquaCloud"
            leftSection={<IconInfoCircle size={20} />}
            component={Link}
            active={location.pathname === '/about'}
            to="/about"
            mb="xs"
          />
          <NavLink
            label="Settings"
            leftSection={<IconSettings size={20} />}
            component={Link}
            active={location.pathname === '/settings'}
            to="/settings"
            mb="xs"
          />
        </AppShell.Section>
        <AppShell.Section>
          {isAdmin && (
            <Select
              label="DEMO - Velg oppdretter"
              value={selectedFarmer}
              onChange={setSelectedFarmer}
              data={
                farmersLoading
                  ? []
                  : (farmers || []).map((f) => ({
                    value: f.farmer_group_key,
                    label: f.name,
                  }))
              }
              placeholder={farmersLoading ? "Laster..." : "Velg oppdretter"}
              error={farmersError && "Feil ved lasting av oppdrettere"}
              searchable
              disabled={farmersLoading}
            />
          )}
        </AppShell.Section>


      </AppShell.Navbar>
      <FilterSidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />


      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}