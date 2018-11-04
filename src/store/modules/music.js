import { startsWith } from 'lodash'

export const LOAD_CURRENT_NODE = 'MUSIC/LOAD_CURRENT_NODE'
export const PUSH_CURRENT_NAVIGATION_NODE = 'MUSIC/PUSH_CURRENT_NAVIGATION_NODE'
export const LOAD_CHILD_NODE = 'MUSIC/LOAD_CHILD_NODE'
export const ADD_CHILD_NODE = 'MUSIC/ADD_CHILD_NODE'
export const UPDATE_CURRENT_NODE = 'MUSIC/UPDATE_CURRENT_NODE'
export const UPDATE_PREV_NODE = 'MUSIC/UPDATE_PREV_NODE'
export const UPDATE_NEXT_NODE = 'MUSIC/UPDATE_NEXT_NODE'
export const UPDATE_ALL_NODES = 'MUSIC/UPDATE_ALL_NODES'
export const CLEAR_ALL_NODES = 'MUSIC/CLEAR_ALL_NODES'

export function clearNodes() {
  return {
    type: CLEAR_ALL_NODES
  }
}
export function loadChildNode(path) {
  return {
    type: LOAD_CHILD_NODE,
    path,
  }
}
export function addChildNode(node, path, resolvePath) {
  return {
    type: ADD_CHILD_NODE,
    node, path, resolvePath
  }
}
export function updatePrevNode(path) {
  return {
    type: UPDATE_PREV_NODE,
    path
  }
}
export function updateCurrentNode(path) {
  return {
    type: UPDATE_CURRENT_NODE,
    path
  }
}
export function updateNextNode(path) {
  return {
    type: UPDATE_NEXT_NODE,
    path
  }
}
export function updateAllNodes(payload) {
  return {
    type: UPDATE_ALL_NODES,
    payload
  }
}
const initialState = {
  prevNode: null,
  currentNode: null, // TODO: make sure currentNode is null when refreshiing a page, or else it will always load node in state
  nextNode: null,
  currentParent: null,
  nodes: {},
  pathResolvers: {},
  errorMsg: {}
}

const addNode = (state, {node, path, resolvePath, payload}) => {
  const newState = Object.assign({}, state)
  const key = path || node.result
  newState.nodes[key] = node
  newState.pathResolvers[path] = resolvePath
  newState.errorMsg = payload
  return newState
}

export default function musicReducer(state = initialState, action) {
  let newState;
  switch(action.type) {
    case PUSH_CURRENT_NAVIGATION_NODE:
      newState = addNode(state, action.payload)
      return Object.assign(newState, { currentParent: action.payload.result })
    case ADD_CHILD_NODE:
      return addNode(state, action)
    case UPDATE_PREV_NODE:
      newState = Object.assign({}, state)
      newState.prevNode = action.path
      return newState
    case UPDATE_CURRENT_NODE:
      newState = Object.assign({}, state)
      newState.currentNode = action.path
      return newState
    case UPDATE_NEXT_NODE:
      newState = Object.assign({}, state)
      newState.nextNode = action.path
      return newState
    case UPDATE_ALL_NODES:
      newState = Object.assign({}, state)
      newState.prevNode = action.payload.prevNode
      newState.currentNode = action.payload.currentNode
      newState.nextNode = action.payload.nextNode
      return newState
    case CLEAR_ALL_NODES:
      return initialState
    default:
      return state
  }
}
