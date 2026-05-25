import React from 'react';
import {
  ANNOTATIONS,
  EXECUTION_FLOWS,
  zhMessages
} from '../data';
import ExecutionFlow from './ExecutionFlow';
import DesignDecisions from './DesignDecisions';

function DeepDive({ version }) {
  const flow = version ? EXECUTION_FLOWS[version] || null : null;
  const annotations = version ? ANNOTATIONS[version] || null : null;
  const hasDecisions = Boolean(annotations?.decisions?.length);

  if (!flow && !hasDecisions) {
    return null;
  }

  return (
    <div className="lcc-stack">
      {flow ? (
        <section>
          <h3 className="lcc-block-title">{zhMessages.version.execution_flow}</h3>
          <ExecutionFlow flow={flow} />
        </section>
      ) : null}
      {hasDecisions ? (
        <DesignDecisions annotations={annotations} messages={zhMessages} />
      ) : null}
    </div>
  );
}

export default DeepDive;
