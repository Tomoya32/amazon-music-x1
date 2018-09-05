export const LOAD_TRACK = 'track/LOAD_TRACK'
export const ADD_TRACK = 'track/ADD_TRACK'

export function loadTrack(path) {
  return {
    type: LOAD_TRACK,
    path
  }
}

const initialState = {
  tracks: {}, instanceIndex: {}, pathResolvers: {}
}

const addTrack = (state, track, requestPath, responsePath) => {
  const newState = Object.assign({}, state)
  track.responsePath = responsePath || requestPath
  newState.tracks[requestPath] = track
  newState.instanceIndex[requestPath] = 0
  newState.pathResolvers[responsePath] = requestPath
  return newState
}

export default function trackReducer(state = initialState, action) {
  switch(action.type) {
    case ADD_TRACK:
      return addTrack(state, action.payload, action.requestPath, action.responsePath)
    default:
      return state
  }
}