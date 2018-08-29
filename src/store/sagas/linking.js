import { call, put, takeLatest } from 'redux-saga/effects'
import {getCode, pollForCode} from '../../services/auth'
import {LINKING_FETCHING_CODE_SUCCESS, LINKING_FETCHING_CODE_FAILED, LINKING_FETCHING_CODE, LINKING_POLL_FOR_CODE} from '../modules/linking'

function* getAuthDeviceCode(action) {
  try {
    const payload = yield call(getCode)
    yield put({type: LINKING_FETCHING_CODE_SUCCESS, payload})
    yield put({type: LINKING_POLL_FOR_CODE, payload})

  } catch(e) {
    console.warn(e)
    yield put({type: LINKING_FETCHING_CODE_FAILED, message: e.message})
  }
}

function* getTokenFromPolling(action) {
  try {
    const payload = yield call(pollForCode, action.payload)
    yield put({type: 'SET_AUTH', payload})
  } catch(e) {
    console.error(e)
  }
}

function* authSaga() {
  yield takeLatest(LINKING_FETCHING_CODE, getAuthDeviceCode)
  yield takeLatest(LINKING_POLL_FOR_CODE, getTokenFromPolling)
}

export default authSaga