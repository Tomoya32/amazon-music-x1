
export const SHOW_NODE = 'home/SHOW_NODE'
export const SHOW_HOME = 'home/SHOW_HOME'

export function showNode(payload) {
  return {
    type: SHOW_NODE,
    payload
  }
}
export function showHome(payload) {
  return {
    type: SHOW_HOME
  }
}


const initialState = {
  display: 'home',
  parentNodeData: null,
  childDisplay: null
}

export default function homeReducer(state = initialState, action) {
  switch(action.type) {
    case SHOW_NODE:
      return Object.assign({}, state, {display: 'node', ...action.payload})
    case SHOW_HOME:
      return initialState
    default:
      return state
  }
}