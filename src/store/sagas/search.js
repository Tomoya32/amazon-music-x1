import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'
import API from '../../services/service'
import config from '../../config'
import { addChildNode, ADD_CHILD_NODE, clearNodes } from '../modules/music'
import { searchResults, LOAD_SEARCH_NODE, LOAD_SEARCH_LIST } from '../modules/search'
import { CLEAR_AUTH_DATA } from '../modules/auth'
import { handleItemSelection } from '../../lib/utils'

const getData = state => state.music.nodes
const getSearchQuery = state => state.search.term
// Dealing with some circular dependencies here.

function * loadSearchResultsNode (action) {
  try {
    const payload = yield call(API.loadNavigationNode, action.path) // pull search results from API
    const {responseURL} = payload.request
    const responsePath = responseURL.replace(config.music.endpoint, '')
    // add search results to state.music.nodes['/search']:
    yield put({type: ADD_CHILD_NODE, node: payload.data, path: '/search', resolvePath: config.music.base_url + action.path})
    yield put(searchResults(payload)) // adds search results to state.search.results.data
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

function * loadSearchResultsList (action) {
  try {
    yield put(clearNodes()) // should show loading icon
    const payload = yield call(API.loadNavigationNode, action.path) // pull search results from API
    const {responseURL} = payload.request
    const responsePath = responseURL.replace(config.music.endpoint, '')
    // add search results to state.music.nodes['/search']:
    yield put({type: ADD_CHILD_NODE, node: payload.data, path: '/search', resolvePath: config.music.base_url + action.path})
    const { _this, selected, enclosingPath } = action;
    yield handleItemSelection.call(_this, selected, enclosingPath) // where this=HMHLMContainerSearchResults
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
  yield takeLatest(LOAD_SEARCH_LIST, loadSearchResultsList)
}

export default searchSaga
