import React from 'react';
import { cn } from '../../utils/classNames';

export default function BackgroundDepthControl({
  currentValue,
  onChange,
  options,
  title
}) {
  const currentIndex = Math.max(0, options.findIndex((option) => option.id === currentValue));
  const currentOption = options[currentIndex] || options[0];
  const sliderProgress = options.length > 1
    ? (currentIndex / (options.length - 1)) * 100
    : 0;

  const handleSliderChange = (event) => {
    const nextOption = options[Number(event.target.value)];
    if (nextOption) {
      onChange(nextOption.id);
    }
  };

  return (
    <div className="theme-section">
      <div className="background-depth-header">
        <h3 className="theme-panel-title">{title}</h3>
        <span className="background-depth-current">{currentOption.name}</span>
      </div>

      <div className="background-depth-control">
        <div className="background-depth-scale" aria-hidden="true">
          <span className="background-depth-scale-label">亮</span>
          <span className="background-depth-scale-label">暗</span>
        </div>

        <div className="background-depth-slider-shell">
          <div
            className="background-depth-slider-progress"
            style={{ width: `${sliderProgress}%` }}
          />
          <input
            className="background-depth-slider"
            type="range"
            min="0"
            max={Math.max(0, options.length - 1)}
            step="1"
            value={currentIndex}
            onChange={handleSliderChange}
            aria-label={title}
          />
        </div>

        <div className="background-depth-stops" role="list">
          {options.map((option, index) => (
            <button
              key={option.id}
              type="button"
              className={cn('background-depth-stop', currentValue === option.id && 'active')}
              onClick={() => onChange(option.id)}
              aria-label={`切换到${option.name}`}
              role="listitem"
            >
              <span className="background-depth-stop-dot" />
              <span className="background-depth-stop-name">{option.name}</span>
              <span className="background-depth-stop-index">{index + 1}</span>
            </button>
          ))}
        </div>

        <p className="background-depth-description">{currentOption.description}</p>
      </div>
    </div>
  );
}
