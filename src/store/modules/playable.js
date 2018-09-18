export const SET_CURRENT_PLAYABLE = 'PLAYABLES/SET_CURRENT_PLAYABLE'


export function setPlayable(node, item) {
  return {
    type: SET_CURRENT_PLAYABLE,
    node, item
  }
}

const initialState = {
  node: null, item: null
}


export default function playableReducer(state = initialState, action ) {
  switch(action.type) {
    case SET_CURRENT_PLAYABLE:
      return Object.assign({}, state, {node: action.node, item: action.item})
    default:
      return state
  }
}