import React, { createContext, useContext } from 'react';
import { useLocalData } from '../hooks/useLocalData';

const DataContext = createContext<ReturnType<typeof useLocalData> | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const data = useLocalData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
