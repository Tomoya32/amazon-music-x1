export const LOAD_CURRENT_NODE = 'MUSIC/LOAD_CURRENT_NODE'
export const PUSH_CURRENT_NAVIGATION_NODE = 'MUSIC/PUSH_CURRENT_NAVIGATION_NODE'
export const LOAD_CHILD_NODE = 'MUSIC/LOAD_CHILD_NODE'
export const ADD_CHILD_NODE = 'MUSIC/ADD_CHILD_NODE'

export function loadChildNode(path) {
  return {
    type: LOAD_CHILD_NODE,
    path
  }
}
export function addChildNode(node, path, resolvePath) {
  return {
    type: ADD_CHILD_NODE,
    node, path, resolvePath
  }
}
const initialState = {
  currentParent: null,
  nodes: {},
  pathResolvers: {}
}

const addNode = (state, {node, path, resolvePath}) => {
  const newState = Object.assign({}, state)
  const key = path || node.result
  newState.nodes[key] = node
  newState.pathResolvers[path] = resolvePath
 // Object.assign(newState.itemDescriptions, {...node.itemDescriptions})
  return newState
}

export default function musicReducer(state = initialState, action) {
  switch(action.type) {
    case PUSH_CURRENT_NAVIGATION_NODE:
      const newState = addNode(state, action.payload)
      return Object.assign(newState, { currentParent: action.payload.result })
    case ADD_CHILD_NODE:
      return addNode(state, action)
    default:
      return state
  }
}