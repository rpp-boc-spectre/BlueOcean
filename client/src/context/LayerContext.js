import React from 'react';

const LayerStore = React.createContext();
LayerStore.displayName = 'LayerStore';

export const useLayerStore = () => React.useContext(LayerStore);

export const LayerStoreProvider = ({ children, initialState, reducer }) => {
  const [globalState, dispatch] = React.useReducer(reducer, initialState);

  return (
    <LayerStore.Provider value={[globalState, dispatch]}>{children}</LayerStore.Provider>
  );
};