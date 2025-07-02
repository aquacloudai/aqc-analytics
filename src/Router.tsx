import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
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
import { OmaquaCloud } from './pages/OmAquacloud';
import { Sites } from './pages/Sites';
import { Site } from './pages/Site'; // create this page



const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },

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
      { path: 'about', element: <OmaquaCloud /> },
      {
        path: 'sites',
        element: <Outlet />, // wrapper for list and detail
        children: [
          { index: true, element: <Sites /> }, // /sites
          { path: ':site_id', element: <Site /> }, // /sites/:site_id
        ],
      }

    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

