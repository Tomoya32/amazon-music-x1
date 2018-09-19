export const SET_AUTH_DATA = 'AUTH/SET_AUTH_DATA'
export const CLEAR_AUTH_DATA = 'AUTH/CLEAR_AUTH_DATA'

const initialState = {
  access_token: null,
  refresh_token: null,
  token_type: 'bearer',
  expires_in: null,
  expires_at: null
}

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case SET_AUTH_DATA:
      const expires_at = new Date()
      expires_at.setSeconds(expires_at.getSeconds() + action.payload.expires_in)
      return Object.assign(action.payload, {expires_at})
    case CLEAR_AUTH_DATA:
      return initialState
    default:
      return state
  }
}
