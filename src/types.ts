export interface Variation {
  id?: number;
  name: string;
}

export interface DailyData {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

export interface ChartData {
  variations: Variation[];
  data: DailyData[];
}

export interface ProcessedDataPoint {
  date: string;
  [key: string]: string | number;
}

export type TimeRange = 'day' | 'week';

export type LineStyle = 'monotone' | 'natural' | 'area';

export interface ZoomState {
  left: number | null;
  right: number | null;
}
