export const ADD_PLAYER = 'APP/PLAYER_TABLE/ADD_PLAYER';
export const ADD_PLAYERS = 'APP/PLAYER_TABLE/ADD_PLAYERS';
export const REMOVE_PLAYER = 'APP/PLAYER_TABLE/REMOVE_PLAYER';
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

export const addPlayers = (players) => ({
  type: ADD_PLAYERS,
  players,
});

/**
 * @param playerId: int
 * @param property: string
 * @param value: any
 */

export const updatePlayerProperty = (playerId, property, value) => ({
  type: UPDATE_PLAYER_PROP,
  payload: { playerId, property, value },
});

/**
 * @param playerId: int, id of the player to remove
 */
export const removePlayer = (playerId) => ({
  type: REMOVE_PLAYER,
  playerId,
})

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

  if (action.type === REMOVE_PLAYER) {
    delete state.allPlayers[action.playerId]

    return {
      ...state
    }
  }

};

