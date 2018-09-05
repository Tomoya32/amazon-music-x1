import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'
import API from '../../services/music'
import {
  LOAD_CURRENT_NODE, PUSH_CURRENT_NAVIGATION_NODE, LOAD_CHILD_NODE, ADD_CHILD_NODE
} from '../modules/music'
import { SET_AUTH_DATA } from '../modules/auth'


const getData = state => state.music.nodes
// Dealing with some circular dependencies here.

function * loadNodeForRoute (action) {
  try {
    const payload = yield call(API.loadNavigationNode, action.payload)
    yield put({type: PUSH_CURRENT_NAVIGATION_NODE, payload})
  } catch (e) {
    console.warn(`Error loading Node for route ${action.payload} ${e.message}`, e)
  }
}

function * loadNavigationNode(action) {
  try {
    const payload = yield call(API.loadNavigationNode, action.path)
    yield put({type: ADD_CHILD_NODE, payload, path: action.path})
  } catch (e) {
    console.warn(`Error loading Node for route ${action.payload} ${e.message}`, e)
  }
}

function * trackAccessToken (action) {
  try {
    yield call(API.setToken, action.payload.access_token)
  } catch (e) {
    console.error('Issue tracking access token ', e)
  }
}

function * registerPathChange (action) {
  try {
    const {pathname} = action.payload.location
    if (API.loggedIn() && /^\/?list(\/|$)/.test(pathname)) {
      let key = action.payload.location.pathname.replace(/^\/list/, '')
      key = key.trim() === '' ?  '/' : key
      const data = yield select(getData)
      if(!data[key]) yield put({type: LOAD_CHILD_NODE, path: key})
      // TODO: Handle loading data here....
    } else if (API.loggedIn() && /^\/?music(\/|$)/.test(pathname)) { // TODO: Need a mechanism for managing these
      console.info('registered path change in music')
      yield(put({type: LOAD_CURRENT_NODE, payload: pathname.replace(/(^\/?music(\/|$))/, '')}))
    }
  } catch (e) {
    console.warn(`Error registering for path change ${e.message}`, e)
  }
}

function * musicSaga () {
  yield takeLatest(LOAD_CURRENT_NODE, loadNodeForRoute)
  yield takeEvery(LOAD_CHILD_NODE, loadNavigationNode)
  yield takeLatest(SET_AUTH_DATA, trackAccessToken)
  yield takeLatest('@@router/LOCATION_CHANGE', registerPathChange)
}

export default musicSaga