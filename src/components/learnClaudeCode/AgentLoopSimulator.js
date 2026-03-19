import React, { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import { SCENARIOS, zhMessages } from '../../vendor/learn-claude-code/data';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function AgentLoopSimulator({ version }) {
  const scenario = SCENARIOS[version];
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setCurrentIndex(-1);
    setIsPlaying(false);
  }, [version]);

  useEffect(() => {
    if (!isPlaying || !scenario) {
      return undefined;
    }

    if (currentIndex >= scenario.steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 1200 / speed);

    return () => window.clearTimeout(timer);
  }, [currentIndex, isPlaying, scenario, speed]);

  if (!scenario) {
    return null;
  }

  const visibleSteps = scenario.steps.slice(0, currentIndex + 1);

  return (
    <section className="lcc-card">
      <h3 className="lcc-block-title">{zhMessages.version.simulator}</h3>
      <p className="lcc-muted-copy">{scenario.description}</p>

      <div className="lcc-sim-controls">
        <div className="lcc-sim-buttons lcc-step-controls-buttons">
          <button
            type="button"
            className="lcc-step-control-btn"
            onClick={() => {
              setCurrentIndex(-1);
              setIsPlaying(false);
            }}
            title={zhMessages.sim.reset}
            aria-label={zhMessages.sim.reset}
          >
            <RotateCcw size={16} />
          </button>
          {isPlaying ? (
            <button
              type="button"
              className="lcc-step-control-btn lcc-step-control-btn-primary"
              onClick={() => setIsPlaying(false)}
              title={zhMessages.sim.pause}
              aria-label={zhMessages.sim.pause}
            >
              <Pause size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="lcc-step-control-btn lcc-step-control-btn-primary"
              onClick={() => setIsPlaying(true)}
              disabled={currentIndex >= scenario.steps.length - 1}
              title={zhMessages.sim.play}
              aria-label={zhMessages.sim.play}
            >
              <Play size={16} />
            </button>
          )}
          <button
            type="button"
            className="lcc-step-control-btn"
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, scenario.steps.length - 1))}
            disabled={currentIndex >= scenario.steps.length - 1}
            title={zhMessages.sim.step}
            aria-label={zhMessages.sim.step}
          >
            <SkipForward size={16} />
          </button>
        </div>

        <div className="lcc-speed-row">
          <span>{zhMessages.sim.speed}:</span>
          {[0.5, 1, 2, 4].map((item) => (
            <button
              key={item}
              type="button"
              className={cn(speed === item && 'active')}
              onClick={() => setSpeed(item)}
            >
              {item}x
            </button>
          ))}
        </div>

        <span className="lcc-counter">
          {Math.max(0, currentIndex + 1)} {zhMessages.sim.step_of} {scenario.steps.length}
        </span>
      </div>

      <div className="lcc-sim-log">
        {visibleSteps.length === 0 ? (
          <div className="lcc-empty-inline">Press Play or Step to begin</div>
        ) : (
          visibleSteps.map((step, index) => (
            <div key={`${step.type}-${index}`} className={cn('lcc-sim-step', `type-${step.type}`)}>
              <div className="lcc-sim-step-head">
                <span>{step.type}</span>
                {step.toolName ? <strong>{step.toolName}</strong> : null}
              </div>
              {step.type === 'tool_call' || step.type === 'tool_result' || step.type === 'system_event' ? (
                <pre>{step.content || '(empty)'}</pre>
              ) : (
                <p>{step.content}</p>
              )}
              <em>{step.annotation}</em>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AgentLoopSimulator;
