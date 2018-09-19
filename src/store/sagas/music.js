import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'
import API from '../../services/music'
import config from '../../config'
import {
  addChildNode, LOAD_CHILD_NODE, ADD_CHILD_NODE
} from '../modules/music'
import { SET_AUTH_DATA, CLEAR_AUTH_DATA } from '../modules/auth'

const getData = state => state.music.nodes

// Dealing with some circular dependencies here.

function * loadNavigationNode (action) {
  try {
    const payload = yield call(API.loadNavigationNode, action.path)
    const {responseURL} = payload.request
    const responsePath = responseURL.replace(/.*\/\/[^/]*/, '')
    yield put(addChildNode(payload.data, action.path, responsePath))
    // yield put({type: ADD_CHILD_NODE, payload: payload.data, path: action.path})
  } catch (e) {
    console.warn(`Error loading Node for route ${action.payload} ${e.message}, ${e.status}`, e.data)
    if (e.status === 401 || e.status === 403) {
      yield put({type: CLEAR_AUTH_DATA})
    }
    if (e.data) {
      yield put({type: ADD_CHILD_NODE, payload: e.data, path: action.path})
    }
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
  console.info('path change ', action, /^\/?music(\/|$)/.test(action.payload.location.pathname), API.loggedIn())
  try {
    const {pathname} = action.payload.location
    if (API.loggedIn() && /^\/?list(\/|$)/.test(pathname)) {
      let key = action.payload.location.pathname.replace(/^\/list\/*/, '/')
      key = key.trim() === '' ? '/' : key
      const data = yield select(getData)
      if (!data[key]) {
        yield put({type: LOAD_CHILD_NODE, path: key})
      }
      // TODO: Handle loading data here....
    } else if (API.loggedIn() && /^\/?music(\/|$)/.test(pathname)) { // TODO: Need a mechanism for managing these
      let path = pathname.replace(/(^\/?music(\/|$))/, '/')
      if (!path || path.trim() === '') path = config.music.browse_node
      console.info(`Music loading path ${path}`)
      yield(put({type: LOAD_CHILD_NODE, path}))
    }
  } catch (e) {
    console.warn(`Error registering for path change ${e.message}`, e)
  }
}

function * musicSaga () {
  // yield takeLatest(LOAD_CURRENT_NODE, loadNodeForRoute)
  yield takeEvery(LOAD_CHILD_NODE, loadNavigationNode)
  yield takeLatest(SET_AUTH_DATA, trackAccessToken)
  yield takeLatest('@@router/LOCATION_CHANGE', registerPathChange)
}

export default musicSaga