function push (state, location) {
  state.stack.push(location.key)
  state.locations[location.key] = location
  return state
}

function replace (state, location) {
  const loc = state.stack.pop()
  if (loc) delete state.locations[loc.key]
  state.stack.push(location.key)
  state.locations[location.key] = location
  return state
}

function back (state) {
  if (!state.stack.length) return null
  const loc = state.stack.pop()
  if (loc) delete state.locations[loc.key]
  return state
}

const initialState = {
  stack: [], locations: {}
}

export default function historyReducer (state = initialState, action) {
  if (action && action.type === '@@router/LOCATION_CHANGE') {
    const newState = Object.assign({}, state)
    switch (action.payload.action) {
      case 'POP':
        return back(newState)
      case 'PUSH':
        return push(newState, action.payload.location)
      case 'REPLACE':
        return replace(newState, action.payload.location)
      default:
        return state
    }
  } else return state
}