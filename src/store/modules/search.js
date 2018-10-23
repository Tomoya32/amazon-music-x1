export const AMZN_SEARCH_RESULTS = 'search/AMZN_SEARCH_RESULTS'
export const AMZN_ADD_LETTER_TO_SEARCHTERM = 'search/AMZN_ADD_LETTER_TO_SEARCHTERM'
export const AMZN_REMOVE_LETTER_FROM_SEARCHTERM = 'search/AMZN_REMOVE_LETTER_FROM_SEARCHTERM'
export const AMZN_SET_SEARCHTERM = 'search/AMZN_SET_SEARCHTERM'
export const AMZN_RESET_SEARCH= 'search/AMZN_RESET_SEARCH'

export const resetSearch = () => {
  return {type: AMZN_RESET_SEARCH}
}

export const searchResults = (payload) => {
  return {
    type: AMZN_SEARCH_RESULTS,
    payload
  }
}
export const setSearchTerm = (term) => {
  return {
    type: AMZN_SET_SEARCHTERM,
    term
  }
}

export const addSingleLetter = (letter) => {
  return {
    type: AMZN_ADD_LETTER_TO_SEARCHTERM,
    letter: letter.toString().substring(0, 1) // a little validation
  }
}

export const removeLetterFromSearchTerm = () => {
  return {
    type: AMZN_REMOVE_LETTER_FROM_SEARCHTERM
  }
}

export const addLetterToSearchTerm = letter => (dispatch) => {
  dispatch(addSingleLetter(letter))
}

const ACTION_HANDLERS = {
  [AMZN_SEARCH_RESULTS]: (state, action) => Object.assign({}, state, {results: action.payload}),
  [AMZN_ADD_LETTER_TO_SEARCHTERM]: (state, action) => Object.assign({}, state, {term: state.term + action.letter}),
  [AMZN_REMOVE_LETTER_FROM_SEARCHTERM]: (state, action) => Object.assign({}, state, {term: state.term.slice(0, -1)}),
  [AMZN_SET_SEARCHTERM]: (state, action) => Object.assign({}, state, {term: action.term}),
  [AMZN_RESET_SEARCH]: (state, action) => Object.assign({}, state, {results: [], term: ''}),
}

const initialState = {
  results: [],
  term: ''
}

export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
