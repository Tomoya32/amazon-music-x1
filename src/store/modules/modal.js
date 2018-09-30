export const OPEN_MODAL = 'MODAL/OPEN_MODAL'
export const CLOSE_MODAL = 'MODAL/CLOSE_MODAL'
export const TOGGLE_MODAL = 'MODAL/TOGGLE_MODAL'

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

const initialState = {
  showModal: false
}

export default function modalReducer(state = initialState, action) {
  switch(action.type) {
    case TOGGLE_MODAL:
      return Object.assign({}, state, {showModal: !state.showModal})
    case OPEN_MODAL:
      return Object.assign({}, state, {showModal: true})
    case CLOSE_MODAL:
      return Object.assign({}, state, {showModal: false})
    default:
      return state
  }
}
