export const REACTV_MENU_UPDATE = 'reactv-redux/REACTV_MENU_UPDATE'

export function updateMenu (id, payload) {
  return {
    type: REACTV_MENU_UPDATE,
    id,
    payload
  }
}

const defaultState = {
  menus: {}
}

export default function navigationReducer (state = defaultState, action) {
  switch (action.type) {
    case REACTV_MENU_UPDATE:
      const menus = Object.assign({}, state.menus)
      menus[action.id] = Object.assign({}, menus[action.id], action.payload)
      return {menus}
    default:
      return state
  }
}
