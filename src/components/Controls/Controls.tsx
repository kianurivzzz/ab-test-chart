import type { TimeRange, Variation, LineStyle } from '../../types';
import { getVariationId } from '../../utils/dataProcessor';
import styles from './Controls.module.css';

interface ControlsProps {
  variations: Variation[];
  selectedVariations: Set<string>;
  onVariationToggle: (varId: string) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  lineStyle: LineStyle;
  onLineStyleChange: (style: LineStyle) => void;
  isDarkTheme: boolean;
  onThemeToggle: () => void;
  onZoomReset: () => void;
  onExportPNG: () => void;
  hasZoom: boolean;
}

const Controls = ({
  variations,
  selectedVariations,
  onVariationToggle,
  timeRange,
  onTimeRangeChange,
  lineStyle,
  onLineStyleChange,
  isDarkTheme,
  onThemeToggle,
  onZoomReset,
  onExportPNG,
  hasZoom,
}: ControlsProps) => {
  return (
    <div className={styles.controls}>
      <div className={styles.row}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Variations</h3>
          <div className={styles.buttons}>
            {variations.map((variation) => {
              const varId = getVariationId(variation);
              const isSelected = selectedVariations.has(varId);
              const isDisabled = isSelected && selectedVariations.size === 1;

              return (
                <button
                  key={varId}
                  className={`${styles.button} ${isSelected ? styles.selected : ''}`}
                  onClick={() => !isDisabled && onVariationToggle(varId)}
                  disabled={isDisabled}
                >
                  {variation.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Time Range</h3>
          <div className={styles.buttons}>
            <button
              className={`${styles.button} ${timeRange === 'day' ? styles.selected : ''}`}
              onClick={() => onTimeRangeChange('day')}
            >
              Day
            </button>
            <button
              className={`${styles.button} ${timeRange === 'week' ? styles.selected : ''}`}
              onClick={() => onTimeRangeChange('week')}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Line Style</h3>
          <div className={styles.buttons}>
            <button
              className={`${styles.button} ${lineStyle === 'monotone' ? styles.selected : ''}`}
              onClick={() => onLineStyleChange('monotone')}
            >
              Line
            </button>
            <button
              className={`${styles.button} ${lineStyle === 'natural' ? styles.selected : ''}`}
              onClick={() => onLineStyleChange('natural')}
            >
              Smooth
            </button>
            <button
              className={`${styles.button} ${lineStyle === 'area' ? styles.selected : ''}`}
              onClick={() => onLineStyleChange('area')}
            >
              Area
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Actions</h3>
          <div className={styles.buttons}>
            <button
              className={`${styles.button} ${isDarkTheme ? styles.selected : ''}`}
              onClick={onThemeToggle}
              title="Toggle theme"
            >
              {isDarkTheme ? 'Light' : 'Dark'}
            </button>
            <button
              className={styles.button}
              onClick={onZoomReset}
              disabled={!hasZoom}
              title="Reset zoom"
            >
              Reset Zoom
            </button>
            <button className={styles.button} onClick={onExportPNG} title="Export to PNG">
              Export PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
