export const GIVE_THUMBS = 'thumbs/GIVE_THUMBS'
export const DISPLAY_THUMBS_MESSAGE = 'thumbs/DISPLAY_THUMBS_MESSAGE'
export const HIDE_THUMBS_MESSAGE = 'thumbs/HIDE_THUMBS_MESSAGE'

export function sendThumbs(trackRatingRequest) {
  return {
    type: GIVE_THUMBS,
    trackRatingRequest
  }
}

const initialState = {
  shouldSkip: false,
  message: '',
}

export default function thumbsReducer(state = initialState, action) {
  switch(action.type) {
    case DISPLAY_THUMBS_MESSAGE:
      const { shouldSkip, message } = action.payload;
      return Object.assign({}, state, { shouldSkip, message })
    case HIDE_THUMBS_MESSAGE:
      return Object.assign({}, state, initialState)
    default:
      return state
  }
}
