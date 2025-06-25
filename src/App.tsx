import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './components/AuthProvider';
import { MockAuthProvider } from './components/MockAuthProvider';
import { isAuthEnabled } from './config/auth';
import { Router } from './Router';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const AuthComponent = isAuthEnabled ? AuthProvider : MockAuthProvider;
  
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications />
        <AuthComponent>
          <Router />
        </AuthComponent>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;