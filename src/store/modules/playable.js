import {isNormalInteger} from '../../lib/utils'

export const SET_CURRENT_PLAYABLE = 'PLAYABLES/SET_CURRENT_PLAYABLE'


export function setPlayable(node, chunk, indexWithinChunk) {
  return {
    type: SET_CURRENT_PLAYABLE,
    node, chunk, indexWithinChunk
  }
}

const initialState = {
  node: null, chunk: null, index: 0
}


export default function playableReducer(state = initialState, action ) {
  switch(action.type) {
    case SET_CURRENT_PLAYABLE:
      const indexWithinChunk = isNormalInteger(action.indexWithinChunk) ?  action.indexWithinChunk : 0
      return Object.assign({}, state, {node: action.node, chunk: action.chunk, indexWithinChunk })
    default:
      return state
  }
}