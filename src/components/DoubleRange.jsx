import { useMemo } from 'react';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function DoubleRange({
  min = 0,
  max = 100,
  step = 1,
  from,
  to,
  onFromChange,
  onToChange,
  leftLabel,
  middleLabel,
  rightLabel,
}) {
  const safeFrom = clamp(Number(from ?? min), min, max);
  const safeTo = clamp(Number(to ?? max), min, max);

  const rangeStart = Math.min(safeFrom, safeTo);
  const rangeEnd = Math.max(safeFrom, safeTo);

  const startPercent = ((rangeStart - min) / (max - min)) * 100;
  const endPercent = ((rangeEnd - min) / (max - min)) * 100;

  const trackStyle = useMemo(
    () => ({
      left: `${startPercent}%`,
      width: `${endPercent - startPercent}%`,
    }),
    [startPercent, endPercent]
  );

  return (
    <div className="double-range">
      <div className="double-range__track">
        <div className="double-range__track-base" />
        <div className="double-range__track-active" style={trackStyle} />
      </div>

      <input
        className="double-range__input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={rangeStart}
        onChange={(event) => {
          const value = Number(event.target.value);
          onFromChange(Math.min(value, rangeEnd));
        }}
      />

      <input
        className="double-range__input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={rangeEnd}
        onChange={(event) => {
          const value = Number(event.target.value);
          onToChange(Math.max(value, rangeStart));
        }}
      />

      <div className="double-range__labels">
        <span>{leftLabel}</span>
        <span>{middleLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}