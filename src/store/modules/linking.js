export const LINKING_FETCHING_CODE = 'LINKING/LINKING_FETCHING_CODE'
export const LINKING_FETCHING_CODE_FAILED = 'LINKING/LINKING_FETCHING_CODE_FAILED'
export const LINKING_FETCHING_CODE_SUCCESS = 'LINKING/LINKING_FETCHING_CODE_SUCCESS'
export const LINKING_POLLING = 'LINKING/LINKING_POLLING'


const requestState = {
  device_code: null,
  user_code: null,
  errorMessage: null,
  expires_in: null,
  verification_url: null,
  error_message: null
}
const initialState = Object.assign({
  polling: false,
}, requestState)


export const getCode = () => ({type: LINKING_FETCHING_CODE})


export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case LINKING_FETCHING_CODE:
      return Object.assign({}, state, requestState)
    case LINKING_FETCHING_CODE_SUCCESS:
      return Object.assign({}, state, action.payload)
    case LINKING_FETCHING_CODE_FAILED:
      return Object.assign({}, state, {error_message: action.message})
    default:
      return state
  }
}