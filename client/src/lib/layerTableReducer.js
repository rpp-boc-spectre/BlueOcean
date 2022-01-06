export const ADD_LAYER = 'APP/LAYER_TABLE/ADD_LAYER';
export const ADD_LAYERS = 'APP/LAYER_TABLE/ADD_LAYERS';
export const REMOVE_LAYER = 'APP/LAYER_TABLE/REMOVE_LAYER';

export const initialState = {
  allLayers: {},
};

/**
 * @param layer: instance of a layer
 */
export const addLayer = (layer) => ({
  type: ADD_LAYER,
  layer,
});

/**
 * @param layers: array of layer classes
 */
export const addLayers = (layer) => ({
  type: ADD_LAYERS,
  layers,
});

/**
 * @param layerId: int, id of the layer to remove
 */
export const removeLayer = (layerId) => ({
  type: REMOVE_LAYER,
  layerId,
})

export const layerTableReducer = (state = initialState, action) => {

  if (action.type === ADD_LAYER) {
    let obj = {}
    obj[action.layer.id] = action.layer
    return {
      ...state,
      allLayers: { ...state.allLayers, ...obj },
    };
  }

  if (action.type === ADD_LAYERS) {
    return {
      ...state,
      allLayers: [...state.allLayers, ...action.layers],
    };
  }

  if (action.type === REMOVE_LAYER) {
    delete state.allLayers[action.layerId]

    return {
      ...state
    }
  }

};

