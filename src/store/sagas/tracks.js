import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import API from '../../services/music'
import {LOAD_TRACK, ADD_TRACK} from '../modules/tracks'

const getData = state => state.tracks.tracks

function * loadTrackForPath (action) {
  try {
    const payload = yield call(API.loadNavigationNode, action.path)
    const {responseURL} = payload.request
    const responsePath = responseURL.replace(/.*\/\/[^/]*/, '')
    yield put({type: ADD_TRACK, payload: payload.data, requestPath: action.path, responsePath})
  } catch (e) {
    console.warn(`Error loading track for route ${action.path} ${e.message}`, e)
  }
}

function * registerPathChange (action) {
  try {
    const {pathname} = action.payload.location
    if (API.loggedIn() && /^\/?playback(\/|$)/.test(pathname)) {
      let key = action.payload.location.pathname.replace(/^\/?playback(\/|$)/, '')
      key = key.trim() === '' ?  '/' : key
      const data = yield select(getData)
      if(!data[key]) yield put({type: LOAD_TRACK, path: key})
    }
  } catch (e) {
    console.warn(`Error registering for path change ${e.message}`, e)
  }
}
function * trackSaga () {
  yield takeEvery(LOAD_TRACK, loadTrackForPath)
  yield takeLatest('@@router/LOCATION_CHANGE', registerPathChange)
}

export default trackSaga