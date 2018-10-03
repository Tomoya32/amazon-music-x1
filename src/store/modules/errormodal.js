export const DISPLAY_ERROR = 'error_modal/DISPLAY_ERROR'
export const HIDE_ERROR = 'error_modal/HIDE_ERROR'

const INITIAL_STATE = {
  visible: false,
  title: null,
  description: null
}

export function displayError (title, description) {
  return {
    type: DISPLAY_ERROR, title, description
  }
}

export default function errorModalReducer (state = INITIAL_STATE, action) {
  if (action.type === DISPLAY_ERROR) {
    const {title, description} = action
    return Object.assign({}, {visible: true}, {title, description})
  } else if (action.type === HIDE_ERROR) {
    return INITIAL_STATE
  } else {
    return state
  }
}