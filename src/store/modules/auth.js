export const SET_AUTH_DATA = 'AUTH/SET_AUTH_DATA'

const initialState = {
  access_token: null,
  refresh_token: null,
  token_type: 'bearer',
  expires_in: null
}

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case SET_AUTH_DATA:
      return action.payload
    default:
      return state
  }
}
