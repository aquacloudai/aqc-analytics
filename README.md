# AQC Analytics Dashboard

A comprehensive analytics dashboard for salmon farming operations, replacing Retool with a custom solution built with React, TypeScript, and modern web technologies.

## Features

- **Authentication**: Secure login with Keycloak integration
- **Dashboard**: Real-time overview of farm operations with key metrics
- **Analytics**: Advanced data visualization and trend analysis
- **Farm Mapping**: Interactive geographical view of farm locations
- **Reports**: Automated report generation and management
- **Data Filtering**: Complex filtering system for precise data analysis
- **Settings**: User preferences and system configuration

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Framework**: Mantine (components, forms, charts)
- **Routing**: React Router v7
- **State Management**: Zustand
- **Data Fetching**: TanStack Query + Axios
- **Authentication**: Keycloak
- **Charts**: Recharts
- **Maps**: React Leaflet
- **Icons**: Tabler Icons

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── AuthProvider.tsx # Authentication wrapper
│   └── Layout.tsx       # Main layout with navigation
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Analytics.tsx   # Data analysis tools
│   ├── FarmMap.tsx     # Interactive farm map
│   ├── Reports.tsx     # Report management
│   ├── Filters.tsx     # Data filtering interface
│   └── Settings.tsx    # User settings
├── store/              # State management
│   ├── authStore.ts    # Authentication state
│   └── filterStore.ts  # Filter state
├── services/           # API and external services
│   └── api.ts          # Axios instance with auth
├── config/             # Configuration
│   └── keycloak.ts     # Keycloak setup
└── types/              # TypeScript definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- FastAPI backend running
- Keycloak server configured

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:8000
   
   # Keycloak Configuration
   VITE_KEYCLOAK_URL=http://localhost:8080
   VITE_KEYCLOAK_REALM=aqc-realm
   VITE_KEYCLOAK_CLIENT_ID=aqc-analytics
   ```

### Development

Start the development server:
```bash
bun run dev
```

### Building

Build for production:
```bash
bun run build
```

## Authentication Setup

The application uses Keycloak for authentication. Configure your Keycloak realm with:

1. **Client Configuration**:
   - Client ID: `aqc-analytics`
   - Client Protocol: `openid-connect`
   - Access Type: `public`
   - Valid Redirect URIs: `http://localhost:5173/*`

2. **User Attributes**:
   - Add `farmer_id` attribute for farmer-specific data filtering

3. **Roles**:
   - `farmer`: Individual farm operators
   - `admin`: System administrators
   - `analyst`: Data analysts

## Data Filtering System

The application includes a sophisticated filtering system that supports:

- **Date Range Filtering**: Custom date ranges for time-series data
- **Location Filtering**: Filter by farms, pens, and batches
- **Data Privacy**: Show only own farm data for farmers
- **Aggregation Levels**: Daily, weekly, monthly, yearly aggregation
- **Metric Selection**: Choose specific metrics to display

## API Integration

The dashboard integrates with a FastAPI backend for:

- Real-time farm data
- Historical analytics
- Report generation
- User management
- Data aggregation

API client includes:
- Automatic token refresh
- Request/response interceptors
- Error handling
- Authentication integration

## Performance Features

- **Code Splitting**: Dynamic imports for optimal loading
- **Caching**: Query caching with TanStack Query
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Production-ready builds with tree shaking

## Deployment

1. Build the application:
   ```bash
   bun run build
   ```

2. Deploy the `dist/` folder to your web server
3. Configure environment variables for production
4. Ensure CORS is configured on your FastAPI backend
5. Set up SSL certificates for production

## Contributing

1. Follow TypeScript best practices
2. Use conventional commit messages
3. Add tests for new features
4. Update documentation as needed

## License

Private - AQC Analytics Dashboard