import { format, startOfWeek } from 'date-fns';
import type { ChartData, ProcessedDataPoint, TimeRange } from '../types';

export const getVariationId = (variation: { id?: number; name: string }): string => {
  return variation.id !== undefined ? variation.id.toString() : '0';
};

export const calculateConversionRate = (conversions: number, visits: number): number => {
  if (visits === 0) return 0;
  return (conversions / visits) * 100;
};

export const processDataForChart = (
  rawData: ChartData,
  selectedVariations: Set<string>,
  timeRange: TimeRange
): ProcessedDataPoint[] => {
  const { data } = rawData;

  if (timeRange === 'day') {
    return data.map((dayData) => {
      const point: ProcessedDataPoint = {
        date: format(new Date(dayData.date), 'MMM d'),
        fullDate: format(new Date(dayData.date), 'dd/MM/yyyy'),
      };

      selectedVariations.forEach((varId) => {
        const visits = dayData.visits[varId] || 0;
        const conversions = dayData.conversions[varId] || 0;
        point[varId] = Number(calculateConversionRate(conversions, visits).toFixed(2));
      });

      return point;
    });
  } else {
    // Группировка по неделям
    const weeklyData: Record<
      string,
      { visits: Record<string, number>; conversions: Record<string, number> }
    > = {};

    data.forEach((dayData) => {
      const weekStart = format(
        startOfWeek(new Date(dayData.date), { weekStartsOn: 1 }),
        'yyyy-MM-dd'
      );

      if (!weeklyData[weekStart]) {
        weeklyData[weekStart] = { visits: {}, conversions: {} };
      }

      Object.keys(dayData.visits).forEach((varId) => {
        weeklyData[weekStart].visits[varId] =
          (weeklyData[weekStart].visits[varId] || 0) + (dayData.visits[varId] || 0);
        weeklyData[weekStart].conversions[varId] =
          (weeklyData[weekStart].conversions[varId] || 0) + (dayData.conversions[varId] || 0);
      });
    });

    return Object.entries(weeklyData)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([weekStart, weekData]) => {
        const point: ProcessedDataPoint = {
          date: format(new Date(weekStart), 'MMM d'),
          fullDate: format(new Date(weekStart), 'dd/MM/yyyy'),
        };

        selectedVariations.forEach((varId) => {
          const visits = weekData.visits[varId] || 0;
          const conversions = weekData.conversions[varId] || 0;
          point[varId] = Number(calculateConversionRate(conversions, visits).toFixed(2));
        });

        return point;
      });
  }
};

export const getYAxisDomain = (
  data: ProcessedDataPoint[],
  selectedVariations: Set<string>,
  lineStyle?: string
): [number, number] => {
  let min = Infinity;
  let max = -Infinity;

  data.forEach((point) => {
    selectedVariations.forEach((varId) => {
      const value = point[varId] as number;
      if (value !== undefined && !isNaN(value)) {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    });
  });

  if (min === Infinity || max === -Infinity) {
    return [0, 40];
  }

  const paddingMultiplier = lineStyle === 'natural' || lineStyle === 'area' ? 0.2 : 0.1;
  const padding = (max - min) * paddingMultiplier;
  return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
};
