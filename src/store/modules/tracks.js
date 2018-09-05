export const LOAD_TRACK = 'track/LOAD_TRACK'
export const ADD_TRACK = 'track/ADD_TRACK'

export function loadTrack(path) {
  return {
    type: LOAD_TRACK,
    path
  }
}

const initialState = {
  tracks: {}, pathLookup: {}
}

const addTrack = (state, track, path) => {
  const newState = Object.assign({}, state)
  newState.tracks[path] = track
  return newState
}

export default function trackReducer(state = initialState, action) {
  switch(action.type) {
    case ADD_TRACK:
      return addTrack(state, action.payload, action.path)
    default:
      return state
  }
}