export const OPEN_MODAL = 'MODAL/OPEN_MODAL'
export const CLOSE_MODAL = 'MODAL/CLOSE_MODAL'
export const TOGGLE_MODAL = 'MODAL/TOGGLE_MODAL'

export const SHOW_TEXT = 'MODAL/SHOW_TEXT'
export const HIDE_TEXT = 'MODAL/HIDE_TEXT'

export function openModal() {
  console.log('open modal')
  return {
    type: OPEN_MODAL
  }
}

export function closeModal() {
  console.log('close modal')
  return {
    type: CLOSE_MODAL
  }
}

export function showText() {
  return { type: SHOW_TEXT}
}

export function hideText() {
  return { type: HIDE_TEXT}
}

const initialState = {
  showModal: false,
  fading: false,
}

export default function modalReducer(state = initialState, action) {
  switch(action.type) {
    case TOGGLE_MODAL:
      return Object.assign({}, state, {showModal: !state.showModal})
    case OPEN_MODAL:
      return Object.assign({}, state, {showModal: true})
    case CLOSE_MODAL:
      return Object.assign({}, state, {showModal: false})
    case SHOW_TEXT:
      return Object.assign({}, state, {fading: true})
    case HIDE_TEXT:
      return Object.assign({}, state, {fading: false})
    default:
      return state
  }
}
