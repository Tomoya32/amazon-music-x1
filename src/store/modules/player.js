import pick from 'lodash/pick'

export const PLAYER_DISABLE_INIT = 'player/PLAYER_DISABLE_INITIALIZE'
export const PLAYER_ERROR = 'player/PLAYER_ERROR'
export const PLAYER_STATE = 'player/PLAYER_STATE'
export const PLAYER_ON_CAN_PLAY = 'player/PLAYER_ON_CAN_PLAY'
export const PLAYER_CURRENT_SRC = 'player/PLAYER_CURRENT_SRC'
export const PLAYER_UPDATE_CURRENTTIME = 'player/PLAYER_UPDATE_CURRENTTIME'
export const PLAYER_UPDATE_PLAYSTATE = 'player/PLAYER_UPDATE_PLAYSTATE'
export const PLAYER_GOT_DURATION = 'player/PLAYER_GOT_DURATION'
export const PLAYER_SET_PLAYER_DURATION = 'player/PLAYER_SET_PLAYER_DURATION'
export const PLAYER_READY_STATE = 'player/PLAYER_READY_STATE'
export const PLAYER_LOAD_START = 'player/PLAYER_LOAD_START'
export const PLAYER_LOAD_END = 'player/PLAYER_LOAD_END'
export const PLAYER_CLEARING = 'player/PLAYER_CLEARING'
export const PLAYER_SET_PROPERTIES = 'player/PLAYER_SET_PROPERTIES'
export const PLAYER_ENDED = 'player/PLAYER_ENDED'
export const PLAYER_DISABLE = 'player/PLAYER_DISABLE'
export const PLAYER_BAD_STATE = 'player/PLAYER_BAD_STATE'
export const PROGRESSBAR_UPDATE_TIME = 'progressbar/PROGRESSBAR_UPDATE_TIME'

export function setProgressBarTime (payload) {
  return {
    type: PROGRESSBAR_UPDATE_TIME,
    payload
  }
}

export function updateInitOnUpdate(payload) {
  return {
    type: PLAYER_DISABLE_INIT,
    payload
  }
}

export function setPlayerDuration(payload) {
  return {
    type: PLAYER_SET_PLAYER_DURATION, payload
  }
}
export function setBadState(payload) {
  return {
    type: PLAYER_BAD_STATE,
    payload
  }
}

export function playerDisable (payload) {
  return {
    type: PLAYER_DISABLE,
    payload: !!payload
  }
}

export function setProperties (payload) {
  return {
    type: PLAYER_SET_PROPERTIES,
    payload
  }
}

export function onEnded () {
  return {
    type: PLAYER_ENDED
  }
}

export function setClearing (payload) {
  return {
    type: PLAYER_CLEARING,
    payload
  }
}

export function onLoadStart () {
  return {
    type: PLAYER_LOAD_START
  }
}

export function onLoadEnd () {
  return {
    type: PLAYER_LOAD_END
  }
}

export function onReadyStateChange (payload) {
  return {
    type: PLAYER_READY_STATE,
    payload
  }
}

export function setCurrentTime (payload) {
  return {
    type: PLAYER_UPDATE_CURRENTTIME,
    payload
  }
}

export function setPlayerState (payload) {
  return {
    type: PLAYER_UPDATE_PLAYSTATE,
    payload
  }
}

export function playerCurrentSrc (payload) {
  return {
    type: PLAYER_CURRENT_SRC,
    payload
  }
}

export function onCanPlay (payload) {
  return {
    type: PLAYER_ON_CAN_PLAY,
    payload
  }
}

export function setPlayerControlsState (payload) {
  return {
    type: PLAYER_STATE, payload
  }
}

export function playerError (payload) {
  return {
    type: PLAYER_ERROR, payload
  }
}

export function playerGotDuration (payload) {
  return {
    type: PLAYER_GOT_DURATION, payload
  }
}



// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PROGRESSBAR_UPDATE_TIME]: (state, action) => Object.assign({}, state, {progressBarTime: action.payload}),
  [PLAYER_DISABLE_INIT]: (state, action) => Object.assign({}, state, {disableInitOnUpdate: action.payload}),
  [PLAYER_ERROR]: (state, action) => Object.assign({}, state, {currentError: action.payload}),
  [PLAYER_STATE]: (state, action) => Object.assign({}, state, {playerControlsState: action.payload}),
  [PLAYER_ON_CAN_PLAY]: (state, action) => Object.assign({}, state, ...pick(action.payload, [''])),
  [PLAYER_UPDATE_CURRENTTIME]: (state, action) => Object.assign({}, state, {currentTime: action.payload}),
  [PLAYER_UPDATE_PLAYSTATE]: (state, action) => Object.assign({}, state, {playerState: action.payload}),
  [PLAYER_CURRENT_SRC]: (state, action) => Object.assign({}, state, {currentUrl: action.payload, ...audioDefaults}),
  [PLAYER_READY_STATE]: (state, action) => Object.assign({}, state, {readyState: action.payload}),
  [PLAYER_LOAD_START]: (state, action) => Object.assign({}, state, {loadStarted: true}),
  [PLAYER_LOAD_END]: (state, action) => Object.assign({}, state, {loadEnded: true}),
  [PLAYER_ENDED]: (state, action) => Object.assign({}, state, {playbackEnded: true}),
  [PLAYER_SET_PROPERTIES]: (state, action) => Object.assign({}, state, {properties: action.payload}),
  [PLAYER_CLEARING]: (state, action) => Object.assign({}, state, {clearing: action.payload}),
  [PLAYER_GOT_DURATION]: (state, action) => Object.assign({}, state, {duration: action.payload}),
  [PLAYER_SET_PLAYER_DURATION]: (state, action) => Object.assign({}, state, {playerDuration: action.payload}),
  [PLAYER_BAD_STATE]: (state, action) => Object.assign({}, state, {badStateMessage: action.payload}),
  [PLAYER_DISABLE]: (state, action) => Object.assign({}, state, {disablePlayer: action.payload})
}

const audioDefaults = {
  playerControlsState: 'paused',
  currentTime: 0,
  currentError: null,
  duration: 0,
  readyState: 0,
  loadStarted: false,
  loadEnded: false,
  playbackEnded: false,
  disableTimeUpdates: false,
  properties: {},
  disablePlayer: false,
  playerDuration: 0
}

const initialState = {
  progressBarTime: 0,
  disableInitOnUpdate: true,
  playerState: 'playing',
  badStateMessage: 'No message sent'
}

export default function playerReducer (state = {...initialState, ...audioDefaults}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
