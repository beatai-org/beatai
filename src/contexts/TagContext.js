import React, { createContext, useContext, useMemo } from 'react';
import { buildTagModel } from '../domain/docs';

const TagContext = createContext();

export const useTag = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTag must be used within a TagProvider');
  }
  return context;
};

export const TagProvider = ({ children, meta }) => {
  const value = useMemo(() => buildTagModel(meta), [meta]);

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};
