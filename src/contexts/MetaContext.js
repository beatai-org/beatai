import React, { createContext, useContext } from 'react';

const MetaContext = createContext(null);

export function useMeta() {
  const context = useContext(MetaContext);
  if (!context) {
    return { meta: null };
  }
  return context;
}

export function MetaProvider({ meta, children }) {
  return (
    <MetaContext.Provider value={{ meta }}>
      {children}
    </MetaContext.Provider>
  );
}
