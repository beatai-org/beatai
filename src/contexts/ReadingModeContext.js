import React, { createContext, useContext } from 'react';

const ReadingModeContext = createContext({
  isReadingMode: false,
  setReadingMode: () => {},
  toggleReadingMode: () => {}
});

export function ReadingModeProvider({ value, children }) {
  return (
    <ReadingModeContext.Provider value={value}>
      {children}
    </ReadingModeContext.Provider>
  );
}

export function useReadingMode() {
  return useContext(ReadingModeContext);
}
