export const UPDATE_MENU_STATE = 'reactv-redux/UPDATE_MENU_STATE'
export const CLEAR_MENU_STATE = 'reactv-redux/CLEAR_MENU_STATE'

export function updateMenuState (menuid, state) {
  return {
    type: UPDATE_MENU_STATE, menuid, state
  }
}

export function clearMenu (menuid) {
  return {
    type: CLEAR_MENU_STATE, menuid
  }
}

const initialState = {}

export default function reactvReduxReducer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_MENU_STATE:
      let current = state[action.menuid], updated
      if (typeof current === 'object') updated = Object.assign({}, current, action.state)
      else updated = action.state
      return Object.assign({}, state, {[action.menuid]: updated})
    case CLEAR_MENU_STATE:
      const newstate = Object.assign({}, state)
      delete newstate[action.menuid]
      return newstate
      return newstate
    default:
      return state

  }
}