import type { TimeRange, Variation } from '../../types';
import { getVariationId } from '../../utils/dataProcessor';
import styles from './Controls.module.css';

interface ControlsProps {
  variations: Variation[];
  selectedVariations: Set<string>;
  onVariationToggle: (varId: string) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const Controls = ({
  variations,
  selectedVariations,
  onVariationToggle,
  timeRange,
  onTimeRangeChange,
}: ControlsProps) => {
  return (
    <div className={styles.controls}>
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
  );
};

export default Controls;
