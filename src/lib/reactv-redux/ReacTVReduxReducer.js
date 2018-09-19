export const UPDATE_MENU_STATE = 'reactv-redux/UPDATE_MENU_STATE'

export function updateMenuState(menuid, state) {
  return {
    type: UPDATE_MENU_STATE, menuid, state
  }
}

const initialState = {}

export default function reactvReduxReducer(state = initialState, action) {
  if(action.type === UPDATE_MENU_STATE) {
    let current = state[action.menuid], updated
    if(typeof current === 'object') updated = Object.assign({}, current, action.state)
    else updated = action.state
    return Object.assign({}, state, {[action.menuid]: updated})
  } else {
    return state
  }
}
