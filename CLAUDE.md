# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AQC Analytics Dashboard is a React/TypeScript application replacing Retool with a custom salmon farming analytics solution. The application features secure authentication, real-time data visualization, interactive farm mapping, and comprehensive reporting capabilities.

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Run linting
bun run lint

# Preview production build
bun run preview
```

## Architecture

### Application Structure
The application follows a layered architecture with clear separation of concerns:

- **App.tsx**: Root component with provider setup (Mantine, TanStack Query, Auth)
- **Router.tsx**: Centralized routing configuration using React Router v7
- **Layout.tsx**: Main application shell with navigation and user menu
- **Pages**: Feature-specific page components
- **Components**: Reusable UI components
- **Store**: Zustand state management
- **Services**: API communication layer
- **Config**: Environment and authentication configuration

### Authentication System
The application supports dual authentication modes:

1. **Keycloak Mode** (`VITE_AUTH_MODE=keycloak`): Full Keycloak integration with token refresh
2. **Mock Mode** (`VITE_AUTH_MODE=mock`): Development mode with mock authentication

Authentication state is managed via Zustand store (`authStore.ts`) and includes:
- User profile data with roles and farmerId
- Automatic token refresh every 60 seconds
- API request interception for auth headers
- Logout functionality

### State Management
Uses Zustand for client state with two main stores:

1. **authStore.ts**: User authentication state and profile data
2. **filterStore.ts**: Complex filtering system for data analysis including:
   - Date range filtering with dayjs
   - Farm/pen/batch selection
   - Data privacy controls (showOwnDataOnly)
   - Aggregation levels (daily/weekly/monthly/yearly)
   - Metric selection

### API Integration
Axios instance (`services/api.ts`) with:
- Automatic Bearer token injection
- Token refresh on 401 responses
- Base URL configuration via environment variables
- Request/response interceptors for auth handling

### UI Framework
Built with Mantine v8 including:
- Core components and theming
- Date handling with dayjs
- Notifications system
- Charts integration
- Form management

## Key Patterns

### Conditional Authentication
The app switches between real and mock authentication based on `VITE_AUTH_MODE`:

```typescript
const AuthComponent = isAuthEnabled ? AuthProvider : MockAuthProvider;
```

### Route Structure
All routes are children of the Layout component, providing consistent navigation:
- `/` - Dashboard (default)
- `/analytics` - Data analysis tools
- `/map` - Interactive farm mapping
- `/reports` - Report management
- `/filters` - Data filtering interface
- `/settings` - User preferences

### Data Privacy
The filtering system includes `showOwnDataOnly` for farmer-specific data isolation, with farmer identification through the `farmerId` field in user tokens.

### Query Configuration
TanStack Query configured with:
- Single retry on failure
- Disabled refetch on window focus
- Global error handling

## Environment Variables

Required environment variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Authentication Mode
VITE_AUTH_MODE=keycloak  # or 'mock' for development

# Keycloak Configuration (when using keycloak mode)
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=aqc-realm
VITE_KEYCLOAK_CLIENT_ID=aqc-analytics
```

## Development Notes

- Uses Bun as package manager and runtime
- TypeScript with strict configuration
- ESLint with React hooks and TypeScript rules
- Vite for build tooling with SWC for React
- All imports use absolute paths from src/
- Components follow Mantine design system patterns

## Testing and Quality

Before committing changes:
1. Run `bun run lint` to check code quality
2. Ensure TypeScript compilation passes with `bun run build`
3. Test both authentication modes (keycloak and mock)
4. Verify API integration works with backend

## Backend Integration

The application integrates with a FastAPI backend for:
- Real-time farm data retrieval
- Historical analytics processing
- Report generation
- User management and roles
- Data aggregation and filtering

API client automatically handles authentication and token refresh for seamless backend communication.