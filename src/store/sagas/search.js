import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'
import API from '../../services/service'
import config from '../../config'
import { addChildNode, ADD_CHILD_NODE } from '../modules/music'
import { searchResults, clearResults, LOAD_SEARCH_NODE } from '../modules/search'
import { CLEAR_AUTH_DATA } from '../modules/auth'

const getData = state => state.music.nodes
const getSearchQuery = state => state.search.term
// Dealing with some circular dependencies here.

function * loadSearchResultsNode (action) {
  try {
    const payload = yield call(API.loadNavigationNode, action.path)
    const {responseURL} = payload.request
    const responsePath = responseURL.replace(config.music.endpoint, '')
    yield put(clearResults())
    yield put(searchResults(payload))
  } catch (e) {
    if (e.status === 401 || e.status === 403) {
      yield put({type: CLEAR_AUTH_DATA})
    }
    if (e.status === 409)
      console.warn(`Error loading Node for route ${action.payload} ${e.message}, ${e.status}`, e.data)
    if (e.data) {
      yield put({type: ADD_CHILD_NODE, payload: e.data, path: action.path})
    }
  }
}

function * searchSaga () {
  yield takeLatest(LOAD_SEARCH_NODE, loadSearchResultsNode)
}

export default searchSaga
