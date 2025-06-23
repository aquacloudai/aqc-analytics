import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './components/AuthProvider';
import { MockAuthProvider } from './components/MockAuthProvider';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { isAuthEnabled } from './config/auth';
import { theme } from './theme/theme';
import { Router } from './Router';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { colorScheme } = useTheme();
  const AuthComponent = isAuthEnabled ? AuthProvider : MockAuthProvider;
  
  return (
    <MantineProvider theme={theme} forceColorScheme={colorScheme}>
      <Notifications />
      <AuthComponent>
        <Router />
      </AuthComponent>
    </MantineProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;