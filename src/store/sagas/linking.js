import { call, put, takeLatest } from 'redux-saga/effects'
import {getCode, pollForCode} from '../../services/auth'
import {LINKING_FETCHING_CODE_SUCCESS, LINKING_FETCHING_CODE_FAILED, LINKING_FETCHING_CODE} from '../modules/linking'

function* getAuthDeviceCode(action) {
  try {
    const payload = yield call(getCode)
    yield put({type: LINKING_FETCHING_CODE_SUCCESS, payload})
    const token = yield call(pollForCode, payload)
  } catch(e) {
    yield put({type: LINKING_FETCHING_CODE_FAILED, message: e.message})
  }
}


function* authSaga() {
  yield takeLatest(LINKING_FETCHING_CODE, getAuthDeviceCode)
}

export default authSaga