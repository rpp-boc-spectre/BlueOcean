export const ADD_PLAYER = 'APP/PLAYER_TABLE/ADD_PLAYER';
export const ADD_PLAYERS = 'APP/PLAYER_TABLE/ADD_PLAYERS';
export const UPDATE_PLAYER_PITCH = 'APP/PLAYER_TABLE/UPDATE_PLAYER/PITCH';
export const UPDATE_PLAYER_VOLUME = 'APP/PLAYER_TABLE/UPDATE_PLAYER/VOLUME';
export const UPDATE_PLAYER_PROP = 'APP/PLAYER_TABLE/UPDATE_PLAYER/PROP';

export const initialState = {
  allPlayers: {},
};

export const addPlayer = (player) => ({
  type: ADD_PLAYER,
  player,
});

export const updatePlayerProperty = (playerId, property, value) => ({
  type: UPDATE_PLAYER_PROP,
  payload: { playerId, property, value },
});

export const addPlayers = (players) => ({
  type: ADD_PLAYERS,
  players,
});

export const playerTableReducer = (state = initialState, action) => {
  if (action.type === ADD_PLAYER) {
    let obj = {}
    obj[action.player.id] = action.player
    return {
      ...state,
      allPlayers: { ...state.allPlayers, ...obj },
    };
  }

  if (action.type === ADD_PLAYERS) {
    return {
      ...state,
      allPlayers: [...state.allPlayers, ...action.players],
    };
  }

  if (action.type === UPDATE_PLAYER_PROP) {

    const { playerId, property, value } = action.payload

    state.allPlayers[playerId][property] = value

    return {
      ...state,
    };
  }

};