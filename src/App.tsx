import { useState, useMemo } from 'react';
import ConversionChart from './components/ConversionChart/ConversionChart';
import Controls from './components/Controls/Controls';
import { processDataForChart, getVariationId } from './utils/dataProcessor';
import type { ChartData, TimeRange } from './types';
import rawData from './data.json';
import styles from './App.module.css';

const App = () => {
  const data = rawData as ChartData;

  const [selectedVariations, setSelectedVariations] = useState<Set<string>>(() => {
    return new Set(data.variations.map((v) => getVariationId(v)));
  });

  const [timeRange, setTimeRange] = useState<TimeRange>('day');

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

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <h1 className={styles.title}>A/B Test Conversion Rate</h1>
        <Controls
          variations={data.variations}
          selectedVariations={selectedVariations}
          onVariationToggle={handleVariationToggle}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        <ConversionChart
          data={processedData}
          selectedVariations={selectedVariations}
          variationNames={variationNames}
          allVariationIds={allVariationIds}
        />
      </div>
    </div>
  );
};

export default App;
