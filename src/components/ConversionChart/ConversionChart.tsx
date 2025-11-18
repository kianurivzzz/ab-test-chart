import { useMemo, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ReferenceArea,
} from 'recharts';
import type { ProcessedDataPoint, LineStyle, ZoomState } from '../../types';
import { getVariationColor } from '../../constants';
import { getYAxisDomain } from '../../utils/dataProcessor';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import styles from './ConversionChart.module.css';

interface ConversionChartProps {
  data: ProcessedDataPoint[];
  selectedVariations: Set<string>;
  variationNames: Record<string, string>;
  allVariationIds: string[];
  lineStyle: LineStyle;
  isDarkTheme: boolean;
  zoomState: ZoomState;
  onZoomChange: (state: ZoomState) => void;
}

const ConversionChart = ({
  data,
  selectedVariations,
  variationNames,
  allVariationIds,
  lineStyle,
  isDarkTheme,
  zoomState,
  onZoomChange,
}: ConversionChartProps) => {
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);

  const displayData = useMemo(() => {
    if (zoomState.left === null || zoomState.right === null) {
      return data;
    }
    return data.slice(zoomState.left, zoomState.right + 1);
  }, [data, zoomState]);

  const yAxisDomain = useMemo(() => {
    return getYAxisDomain(displayData, selectedVariations, lineStyle);
  }, [displayData, selectedVariations, lineStyle]);

  const variationArray = Array.from(selectedVariations);

  const gridColor = isDarkTheme ? '#404062' : '#E0DEE7';
  const textColor = isDarkTheme ? '#C7C5D0' : '#666';
  const axisColor = isDarkTheme ? '#C7C5D0' : '#999';

  const handleMouseDown = useCallback((e: { activeLabel?: string }) => {
    if (e && e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: { activeLabel?: string }) => {
      if (refAreaLeft && e && e.activeLabel) {
        setRefAreaRight(e.activeLabel);
      }
    },
    [refAreaLeft]
  );

  const handleMouseUp = useCallback(() => {
    if (refAreaLeft && refAreaRight) {
      const leftIndex = data.findIndex((d) => d.date === refAreaLeft);
      const rightIndex = data.findIndex((d) => d.date === refAreaRight);

      if (leftIndex !== -1 && rightIndex !== -1) {
        const left = Math.min(leftIndex, rightIndex);
        const right = Math.max(leftIndex, rightIndex);
        onZoomChange({ left, right });
      }
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
  }, [refAreaLeft, refAreaRight, data, onZoomChange]);

  const getChartType = () => {
    if (lineStyle === 'area') return 'monotone';
    if (lineStyle === 'natural') return 'basis';
    return lineStyle;
  };

  const chartType = getChartType();

  const renderChart = () => {
    const commonProps = {
      data: displayData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    };

    const commonElements = (
      <>
        <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={true} horizontal={true} />
        <XAxis
          dataKey="date"
          stroke={axisColor}
          tick={{ fill: textColor, fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          domain={yAxisDomain}
          stroke={axisColor}
          tick={{ fill: textColor, fontSize: 12 }}
          tickLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          content={<CustomTooltip variationNames={variationNames} />}
          cursor={{ stroke: axisColor, strokeWidth: 1, strokeDasharray: '3 3' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
        {refAreaLeft && refAreaRight && (
          <ReferenceArea
            x1={refAreaLeft}
            x2={refAreaRight}
            strokeOpacity={0.3}
            fill="#a1a3ff"
            fillOpacity={0.3}
          />
        )}
      </>
    );

    if (lineStyle === 'area') {
      return (
        <AreaChart {...commonProps}>
          {commonElements}
          {variationArray.map((varId) => {
            const colorIndex = allVariationIds.indexOf(varId);
            const color = getVariationColor(colorIndex);
            return (
              <Area
                key={varId}
                type="monotone"
                dataKey={varId}
                name={variationNames[varId]}
                stroke={color}
                fill={color}
                fillOpacity={0.3}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            );
          })}
        </AreaChart>
      );
    }

    return (
      <LineChart {...commonProps}>
        {commonElements}
        {variationArray.map((varId) => {
          const colorIndex = allVariationIds.indexOf(varId);
          return (
            <Line
              key={varId}
              type={chartType}
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
    );
  };

  return (
    <div className={styles.chartContainer} id="chart-export">
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
      <p className={styles.zoomHint}>
        Click and drag on the chart to zoom into a specific time range
      </p>
    </div>
  );
};

export default ConversionChart;
