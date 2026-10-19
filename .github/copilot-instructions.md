# OpenJDK Dashboard v2 - AI Coding Instructions

## Project Overview
This is a modern React-based dashboard for visualizing AdoptOpenJDK download statistics. The app is a Single Page Application (SPA) that consumes the AdoptOpenJDK v3 API and displays data through interactive charts.

## Architecture & Key Components

### Core Stack
- **Frontend**: React 19 with modern functional components and hooks
- **Charts**: Highcharts 11 with `highcharts-react-official`
- **Bundler**: Parcel v2 for development and production builds
- **Server**: Express.js with security features (production testing only)
- **Deployment**: Static files to GitHub Pages via automated CI/CD

### Application Structure
```
src/
├── App.js           # Main layout with Ant Design 5 Layout, routing, and sidebar nav
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
- Data fetching happens in `useEffect()` hooks with async/await pattern
- Always format numbers using `formatNum()` utility for display

### State Management
- Modern React functional components with hooks (useState, useEffect, useRef)
- State updates trigger chart re-renders automatically
- Trends component manages complex filter state with multiple useState hooks

### Chart Configuration
- Use Highcharts components from `src/Graph/` directory
- Pie charts for distribution data, line charts for time series
- Data must be transformed to Highcharts format: `[{name, y}]` for pie, `[x, y]` for series
- Import SVG assets using `url:` prefix for Parcel v2 compatibility

### Routing & Navigation
- React Router v6 with modern `<Routes>` and `<Route>` components
- Two main routes: `/download` (default) and `/trends`
- Sidebar navigation uses Ant Design 5 Menu with `items` prop pattern

## Development Workflow

### Development Server (Recommended for Development)
```bash
npm install
npm start  # Starts secure Parcel dev server with hot reloading on port 3000
```
- Uses Parcel v2's built-in development server
- Hot module replacement for fast development
- Secure by default (no sensitive file exposure)
- Automatic rebuilds on file changes

### Production Testing Server (For Testing Builds Locally)
```bash
npm run build  # Build optimized static files
npm run serve  # Start Express server with production files
```
- Uses Express.js server with security features
- Rate limiting (100 req/IP per 15 minutes)
- Only serves built files from `./dist`
- Mimics production environment for testing

### Production Build Only
```bash
npm run build  # Outputs optimized static files to ./dist/
```

### GitHub Pages Deployment
- Auto-deploys from `master` branch via GitHub Actions
- Uses modern GitHub Actions v4 with Node.js 20
- Build artifacts deployed to `gh-pages` branch
- Includes `CNAME` and `404.html` for SPA routing support

## Dependencies & Modern Setup

### Current Modern Versions
- React 19 (functional components with hooks)
- Ant Design v5 (modern component API with `items` props)
- Parcel v2 (modern bundler with better performance)
- Highcharts 11 (latest stable charting library)
- Express.js 4.21+ with `express-rate-limit` for security

### Security Features
- Rate limiting to prevent DoS attacks
- Secure static file serving (no source code exposure)
- Modern CI/CD pipeline with latest GitHub Actions
- SVG assets handled securely with `url:` imports

### External Dependencies
- AdoptOpenJDK v3 API for all data (no local data sources)
- GitHub Pages hosting (static files only, no server-side logic)

## When Making Changes

### Adding New Charts
1. Create reusable chart component in `src/Graph/` as functional component
2. Use hooks (useState, useEffect, useRef) for state management
3. Export from `src/Graph/index.js`
4. Import and use in `Download.js` or `Trends.js`
5. Follow existing Highcharts React patterns

### API Changes
- Modify `src/api.js` for new endpoints
- Use existing `get()` utility for consistency
- Handle async data loading in `useEffect()` hooks
- Clean up with proper dependency arrays

### UI Changes
- Use Ant Design v5 components and patterns
- Use `items` prop for Menu components (not children)
- Import icons from `@ant-design/icons`
- Maintain existing Layout structure in `App.js`
- Follow modern functional component patterns with hooks
