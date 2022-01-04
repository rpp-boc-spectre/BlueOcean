import React from 'react';

const PlayerStore = React.createContext();
PlayerStore.displayName = 'PlayerStore';

export const usePlayerStore = () => React.useContext(PlayerStore);

export const PlayerStoreProvider = ({ children, initialState, reducer }) => {
  const [globalState, dispatch] = React.useReducer(reducer, initialState);

  return (
    <PlayerStore.Provider value={[globalState, dispatch]}>{children}</PlayerStore.Provider>
  );
};