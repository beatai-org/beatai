import React from 'react';

export default function FontSizeControl({
  currentValue,
  onChange,
  title
}) {
  const currentSize = Number(currentValue) || 20;
  const sliderProgress = ((currentSize - 14) / 8) * 100;

  return (
    <div className="theme-section">
      <div className="font-size-control-header">
        <h3 className="theme-panel-title">{title}</h3>
        <span className="font-size-control-current">{currentSize}px</span>
      </div>

      <div className="font-size-control">
        <div className="font-size-scale" aria-hidden="true">
          <span className="font-size-scale-label">14px</span>
          <span className="font-size-scale-label">22px</span>
        </div>

        <div className="font-size-slider-shell">
          <div
            className="font-size-slider-progress"
            style={{ width: `${sliderProgress}%` }}
          />
          <input
            className="font-size-slider"
            type="range"
            min="14"
            max="22"
            step="1"
            value={currentSize}
            onChange={(event) => onChange(event.target.value)}
            aria-label={title}
          />
        </div>

        <div className="font-size-ticks" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => {
            const size = 14 + index;
            const isActive = size <= currentSize;

            return (
              <span
                key={size}
                className={`font-size-tick${isActive ? ' active' : ''}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
