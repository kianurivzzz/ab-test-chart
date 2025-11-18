import { useState, useMemo } from 'react';
import ConversionChart from './components/ConversionChart/ConversionChart';
import Controls from './components/Controls/Controls';
import { processDataForChart, getVariationId } from './utils/dataProcessor';
import type { ChartData, TimeRange, LineStyle, ZoomState } from './types';
import rawData from './data.json';
import styles from './App.module.css';

const App = () => {
  const data = rawData as ChartData;

  const [selectedVariations, setSelectedVariations] = useState<Set<string>>(() => {
    return new Set(data.variations.map((v) => getVariationId(v)));
  });

  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [lineStyle, setLineStyle] = useState<LineStyle>('monotone');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [zoomState, setZoomState] = useState<ZoomState>({ left: null, right: null });

  const allVariationIds = useMemo(() => {
    return data.variations.map((v) => getVariationId(v));
  }, [data.variations]);

  const variationNames = useMemo(() => {
    const names: Record<string, string> = {};
    data.variations.forEach((v) => {
      names[getVariationId(v)] = v.name;
    });
    return names;
  }, [data.variations]);

  const processedData = useMemo(() => {
    return processDataForChart(data, selectedVariations, timeRange);
  }, [data, selectedVariations, timeRange]);

  const handleVariationToggle = (varId: string) => {
    setSelectedVariations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(varId)) {
        if (newSet.size > 1) {
          newSet.delete(varId);
        }
      } else {
        newSet.add(varId);
      }
      return newSet;
    });
  };

  const handleZoomReset = () => {
    setZoomState({ left: null, right: null });
  };

  const handleExportPNG = () => {
    const chartElement = document.getElementById('chart-export');
    if (chartElement) {
      import('html2canvas').then((html2canvas) => {
        html2canvas
          .default(chartElement as HTMLElement, {
            backgroundColor: isDarkTheme ? '#1a1a3e' : '#ffffff',
          })
          .then((canvas) => {
            const link = document.createElement('a');
            link.download = 'ab-test-chart.png';
            link.href = canvas.toDataURL();
            link.click();
          });
      });
    }
  };

  return (
    <div className={`${styles.app} ${isDarkTheme ? styles.darkTheme : ''}`}>
      <div className={styles.container}>
        <h1 className={styles.title}>A/B Test Conversion Rate</h1>
        <Controls
          variations={data.variations}
          selectedVariations={selectedVariations}
          onVariationToggle={handleVariationToggle}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          lineStyle={lineStyle}
          onLineStyleChange={setLineStyle}
          isDarkTheme={isDarkTheme}
          onThemeToggle={() => setIsDarkTheme(!isDarkTheme)}
          onZoomReset={handleZoomReset}
          onExportPNG={handleExportPNG}
          hasZoom={zoomState.left !== null || zoomState.right !== null}
        />
        <ConversionChart
          data={processedData}
          selectedVariations={selectedVariations}
          variationNames={variationNames}
          allVariationIds={allVariationIds}
          lineStyle={lineStyle}
          isDarkTheme={isDarkTheme}
          zoomState={zoomState}
          onZoomChange={setZoomState}
        />
      </div>
    </div>
  );
};

export default App;
