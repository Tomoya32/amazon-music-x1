import { call, put, takeLatest } from 'redux-saga/effects'
import { getCode, pollForCode, refreshToken } from '../../services/auth'
import { SET_AUTH_DATA } from '../modules/auth'
import {
  LINKING_FETCHING_CODE_SUCCESS,
  LINKING_FETCHING_CODE_FAILED,
  LINKING_FETCHING_CODE,
  LINKING_POLL_FOR_CODE,
  LINKING_ERROR
} from '../modules/linking'

function * getAuthDeviceCode (action) {
  try {
    const payload = yield call(getCode)
    yield put({type: LINKING_FETCHING_CODE_SUCCESS, payload})
    yield put({type: LINKING_POLL_FOR_CODE, payload})

  } catch (e) {
    console.warn(e)
    // TODO: This should restart the code process (get a new code)
    // on certain errors. See step 4 at
    // https://developer.amazon.com/docs/alexa-voice-service/code-based-linking-other-platforms.html
    yield put({type: LINKING_FETCHING_CODE_FAILED, message: e.message})
  }
}

function * getTokenFromPolling (action) {
  try {
    const payload = yield call(pollForCode, action.payload)
    yield put({type: SET_AUTH_DATA, payload})
  } catch (e) {
    if (e === 'invalid_code_pair') {
      yield put({type: LINKING_FETCHING_CODE})
    } else {
      yield put({type: LINKING_ERROR})
    }
  }
}

function * refreshTokenGen (action) {
  try {
    const payload = yield refreshToken(action.payload)
    yield put({type: SET_AUTH_DATA, payload})
  } catch (e) {
    console.error(e)
  }
}

function * authSaga () {
  yield takeLatest(LINKING_FETCHING_CODE, getAuthDeviceCode)
  yield takeLatest(LINKING_POLL_FOR_CODE, getTokenFromPolling)
  yield takeLatest(SET_AUTH_DATA, refreshTokenGen)
}

export default authSaga