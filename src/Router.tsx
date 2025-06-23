import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { FarmMap } from './pages/FarmMap';
import { Reports } from './pages/Reports';
import { Filters } from './pages/Filters';
import { Settings } from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'map',
        element: <FarmMap />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'filters',
        element: <Filters />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}