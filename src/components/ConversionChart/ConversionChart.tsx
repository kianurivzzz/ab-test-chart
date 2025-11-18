import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ProcessedDataPoint } from '../../types';
import { getVariationColor } from '../../constants';
import { getYAxisDomain } from '../../utils/dataProcessor';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import styles from './ConversionChart.module.css';

interface ConversionChartProps {
  data: ProcessedDataPoint[];
  selectedVariations: Set<string>;
  variationNames: Record<string, string>;
  allVariationIds: string[];
}

const ConversionChart = ({
  data,
  selectedVariations,
  variationNames,
  allVariationIds,
}: ConversionChartProps) => {
  const yAxisDomain = useMemo(() => {
    return getYAxisDomain(data, selectedVariations);
  }, [data, selectedVariations]);

  const variationArray = Array.from(selectedVariations);

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="0" stroke="#E0DEE7" vertical={true} horizontal={true} />
          <XAxis
            dataKey="date"
            stroke="#999"
            tick={{ fill: '#666', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            domain={yAxisDomain}
            stroke="#999"
            tick={{ fill: '#666', fontSize: 12 }}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={<CustomTooltip variationNames={variationNames} />}
            cursor={{ stroke: '#999', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
          {variationArray.map((varId) => {
            const colorIndex = allVariationIds.indexOf(varId);
            return (
              <Line
                key={varId}
                type="monotone"
                dataKey={varId}
                name={variationNames[varId]}
                stroke={getVariationColor(colorIndex)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConversionChart;
