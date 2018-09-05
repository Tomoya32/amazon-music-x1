import { call, put, takeEvery } from 'redux-saga/effects'
import API from '../../services/music'
import {LOAD_TRACK, ADD_TRACK} from '../modules/tracks'

function * loadTrackForPath (action) {
  try {
    const payload = yield call(API.loadNavigationNode, action.path)
    yield put({type: ADD_TRACK, payload, path: action.path})
  } catch (e) {
    console.warn(`Error loading track for route ${action.path} ${e.message}`, e)
  }
}

function * trackSaga () {
  yield takeEvery(LOAD_TRACK, loadTrackForPath)
}

export default trackSaga