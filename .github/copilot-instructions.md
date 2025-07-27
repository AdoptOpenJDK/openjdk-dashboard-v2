# OpenJDK Dashboard v2 - AI Coding Instructions

## Project Overview
This is a React-based dashboard for visualizing AdoptOpenJDK download statistics. The app is a Single Page Application (SPA) that consumes the AdoptOpenJDK v3 API and displays data through interactive charts.

## Architecture & Key Components

### Core Stack
- **Frontend**: React 16 with Ant Design UI components
- **Charts**: Highcharts with `highcharts-react-official`
- **Bundler**: Parcel (v1) for development and build
- **Server**: Express.js (development only - serves Parcel middleware)
- **Deployment**: Static files to GitHub Pages

### Application Structure
```
src/
├── App.js           # Main layout with Ant Design Layout, routing, and sidebar nav
├── api.js           # AdoptOpenJDK API client (downloads, tracking, monthly stats)
├── utils.js         # HTTP utilities and data formatting helpers
├── ErrorBoundary.jsx # React error boundary wrapper
└── Graph/           # Chart components and page containers
    ├── index.js     # Exports Download and Trends components
    ├── Download.js  # Main dashboard with total downloads and breakdowns
    ├── Trends.js    # Time-series analysis with configurable parameters
    └── [Chart].js   # Reusable Highcharts components
```

## Critical Patterns & Conventions

### API Integration
- All API calls go through `src/api.js` using the custom `get()` utility
- AdoptOpenJDK v3 API endpoints: `https://api.adoptopenjdk.net/v3/stats/downloads/`
- Data fetching happens in `componentDidMount()` with async/await pattern
- Always format numbers using `formatNum()` utility for display

### State Management
- Pure React class components with local state (no Redux/Context)
- State updates trigger chart re-renders automatically
- Trends component manages complex filter state for multiple chart series

### Chart Configuration
- Use Highcharts components from `src/Graph/` directory
- Pie charts for distribution data, line charts for time series
- Data must be transformed to Highcharts format: `[{name, y}]` for pie, `[x, y]` for series

### Routing & Navigation
- React Router v5 with `<Link>` components in Ant Design Menu
- Two main routes: `/download` (default) and `/trends`
- Sidebar navigation uses Ant Design Menu with collapsible state

## Development Workflow

### Local Development
```bash
npm install
npm start  # Starts Express server with Parcel middleware on port 3000
```

### Production Build
```bash
npm run-script build  # Outputs to ./dist/ with static files
```

### GitHub Pages Deployment
- Auto-deploys from `master` branch via GitHub Actions
- Build artifacts copied to `gh-pages` branch
- Includes `CNAME` and `404.html` for SPA routing support

## Dependencies & Constraints

### Legacy Versions (Handle with Care)
- React 16 (class components, no hooks)
- Ant Design v3 (different API than v4+)
- Parcel v1 (different config than v2)
- `http-proxy-middleware` v0.x (legacy API)

### Modern Babel Setup
- Babel 7.25+ with `@babel/plugin-transform-class-properties`
- Supports ES6+ class field syntax and arrow function methods
- Configuration in `src/.babelrc`

### External Dependencies
- AdoptOpenJDK v3 API for all data (no local data sources)
- GitHub Pages hosting (static files only, no server-side logic)

## When Making Changes

### Adding New Charts
1. Create reusable chart component in `src/Graph/`
2. Export from `src/Graph/index.js`
3. Import and use in `Download.js` or `Trends.js`
4. Follow existing Highcharts React patterns

### API Changes
- Modify `src/api.js` for new endpoints
- Use existing `get()` utility for consistency
- Handle async data loading in component `componentDidMount()`

### UI Changes
- Use Ant Design v3 components and patterns
- Maintain existing Layout structure in `App.js`
- Follow collapsible sidebar pattern for responsive design
