# A/B Test Conversion Rate Chart

Interactive line chart visualization for A/B test statistics showing conversion rates across different variations.

## Features

### Implemented Core Features
- **Conversion Rate Visualization** – line chart displaying conversion rate (%) for all variations
- **Interactive Tooltip** – hover over the chart to see detailed daily data with vertical line indicator
- **Variation Selection** – toggle which variations to display, minimum one must be selected
- **Time Range Selector** – switch between Day and Week views
- **Adaptive Axes** – X and Y axes automatically adjust to visible data range
- **Responsive Design** – works on screens from 671px to 1300px width
- **Percentage Display** – all values shown as percentages

## Tech Stack

- **React 19** with **TypeScript**
- **Vite** for build tooling
- **Recharts** for chart visualization
- **date-fns** for date manipulation
- **CSS Modules** for component styling

## Local Setup

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ConversionChart/    # Main chart component
│   ├── Controls/           # Variation and time range controls
│   └── CustomTooltip/      # Hover tooltip
├── utils/
│   └── dataProcessor.ts    # Data processing and conversion rate calculation
├── types.ts                # TypeScript type definitions
├── constants.ts            # Color constants
├── data.json              # A/B test data
└── App.tsx                # Main application component
```

## Data Format

The application uses data from `data.json` with the following structure:

- **variations** – array of test variations. Original, Variation A, B, C
- **data** – daily statistics with visits and conversions per variation

Conversion rate is calculated as: `(conversions / visits) * 100`

## Deployment

The project is configured for deployment to GitHub Pages using GitHub Actions. Push to the `main` branch to trigger automatic deployment.
