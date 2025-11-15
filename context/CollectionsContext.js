import { createContext, useContext } from 'react';

const CollectionsContext = createContext([]);

export function CollectionsProvider({ collections = [], children }) {
  return (
    <CollectionsContext.Provider value={collections}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollectionsContext() {
  return useContext(CollectionsContext);
}
