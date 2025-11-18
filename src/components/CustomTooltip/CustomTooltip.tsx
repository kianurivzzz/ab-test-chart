import styles from './CustomTooltip.module.css';
import CalendarIcon from '../../assets/icons/calendar.svg?react';
import TrophyIcon from '../../assets/icons/trophy.svg?react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    payload?: {
      fullDate?: string;
    };
  }>;
  label?: string;
  variationNames: Record<string, string>;
}

const CustomTooltip = ({ active, payload, label, variationNames }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const maxValue = Math.max(...payload.map((p) => p.value));
  const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
  const fullDate = payload[0]?.payload?.fullDate || label;

  return (
    <div className={styles.tooltip}>
      <div className={styles.dateHeader}>
        <CalendarIcon className={styles.calendarIcon} />
        <span className={styles.dateText}>{fullDate}</span>
      </div>
      <div className={styles.dataList}>
        {sortedPayload.map((entry) => {
          const isWinner = entry.value === maxValue;
          return (
            <div key={entry.dataKey} className={styles.dataItem}>
              <span className={styles.colorDot} style={{ backgroundColor: entry.color }} />
              <span className={styles.name}>
                {variationNames[entry.dataKey]}
                {isWinner && <TrophyIcon className={styles.trophyIcon} />}
              </span>
              <span className={styles.value}>{entry.value.toFixed(2)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomTooltip;
