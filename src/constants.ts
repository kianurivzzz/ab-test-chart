export const CHART_COLORS = ['#46464F', '#4142EF', '#FF8346', '#C0EEE9'];

export const getVariationColor = (index: number): string => {
  return CHART_COLORS[index % CHART_COLORS.length];
};
