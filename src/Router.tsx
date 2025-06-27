import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { FarmMap } from './pages/FarmMap';
import { Reports } from './pages/Reports';
import { Filters } from './pages/Filters';
import { Settings } from './pages/Settings';
import { Temperature } from './pages/Temperature';
import { Trends } from './pages/Trends';

// Fish health subpages
import { Codelist } from './pages/Codelist';
import { Benchmark } from './pages/Benchmark';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },

      {
        path: 'fishhealth',
        element: <Outlet />, // wrapper for fish health submenu
        children: [
          { path: 'trend', element: <Trends /> },
          { path: 'benchmark', element: <Benchmark /> },

          { path: 'codelist', element: <Codelist /> },
        ],
      },

      { path: 'map', element: <FarmMap /> },
      { path: 'reports', element: <Reports /> },
      { path: 'filters', element: <Filters /> },
      { path: 'settings', element: <Settings /> },
      { path: 'temperature', element: <Temperature /> },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
