import { replace as replacer } from 'connected-react-router'

export const REPLACE = 'navigation/REPLACE'
export const BACK = 'navigation/BACK'
export const EXIT = 'navigation/EXIT'

export const replace = path => {
  return dispatch => {
    dispatch({type: REPLACE, path: document.location.href.replace(document.location.origin, '')})
    dispatch(replacer(path))
  }
}

export const back = () => {
  return (dispatch, getState) => {
    const stack = getState().nav.stack
    if(stack.length) {
      const historicPath = stack[stack.length - 1]
      dispatch({type: BACK})
      dispatch(replacer(historicPath))

    } else {
      dispatch({type: EXIT})
    }
  }
}

const initialState = {
  stack: []
}

const addToStack = (state, path) => {
  const newish = Object.assign({}, state)
  newish.stack.push(path)
  return newish
}

const removeFromStack = (state) => {
  const newish = Object.assign({}, state)
  newish.stack.pop()
  return newish
}

export default function hisReducer (state = initialState, action) {
  if(!action) debugger
  switch (action.type) {
    case BACK:
      return removeFromStack(state)
    case REPLACE:
      return addToStack(state, action.path)
    default:
      return state
  }
}