import React, { useState } from 'react';

function DesignDecisions({ annotations, messages }) {
  const [openId, setOpenId] = useState(null);

  if (!annotations || annotations.decisions.length === 0) {
    return null;
  }

  return (
    <section className="lcc-stack">
      <h3 className="lcc-block-title">{messages.version.design_decisions}</h3>
      {annotations.decisions.map((decision) => {
        const isOpen = openId === decision.id;
        const localized = decision.zh || {};
        const title = localized.title || decision.title;
        const description = localized.description || decision.description;

        return (
          <article key={decision.id} className="lcc-card lcc-accordion">
            <button type="button" onClick={() => setOpenId(isOpen ? null : decision.id)}>
              <span>{title}</span>
              <span>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen ? (
              <div className="lcc-accordion-body">
                <p>{description}</p>
                {decision.alternatives ? (
                  <div>
                    <h4>{messages.version.alternatives}</h4>
                    <p>{decision.alternatives}</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}

export default DesignDecisions;
