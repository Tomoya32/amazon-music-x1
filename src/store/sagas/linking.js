import { call, put, takeLatest } from 'redux-saga/effects'
import { getCode, pollForCode, refreshToken, getAuthData, storeAuthData } from '../../services/auth'
import { SET_AUTH_DATA } from '../modules/auth'
import {
  LINKING_FETCHING_CODE_SUCCESS,
  LINKING_FETCHING_CODE_FAILED,
  LINKING_FETCHING_CODE,
  LINKING_POLL_FOR_CODE,
  LINKING_ERROR,
  LINKING_CANCELED
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
    switch (e.error) {
      case 'canceled':
        yield put({type: LINKING_CANCELED})
        break
      case 'invalid_code_pair':
        yield put({type: LINKING_FETCHING_CODE})
        break
      default:
        yield put({type: LINKING_FETCHING_CODE_FAILED, message: e.message})
    }
  }
}

function * getTokenFromPolling (action) {
  try {
    const payload = yield call(pollForCode, action.payload)
    yield put({type: SET_AUTH_DATA, payload})
    yield call(storeAuthData, payload)
  } catch (e) {
    console.error('saga error with token from polling ', e)
    if (e.error === 'invalid_code_pair') {
      yield put({type: LINKING_FETCHING_CODE, message: e.error})
    } else {
      yield put({type: LINKING_ERROR, message: e.error})
    }
  }
}

function * refreshTokenGen (action) {
  try {
    const payload = yield call(refreshToken, action.payload)
    yield put({type: SET_AUTH_DATA, payload})
  } catch (e) {
    console.error(e)
  }
}

function* registerPathChange (action) {
  console.info('Linking found path change')
  try {
    const { pathname } = action.payload.location
    if (/^\/?linking(\/|$)/.test(pathname) ) { // TODO: Need a mechanism for managing these
      console.info('Linking found path change')
      const authData = yield call(getAuthData)
      if(authData) {
        console.info("got auth data, trying token")
        // const payload = yield call(refreshToken, authData, true)
        yield put({type: SET_AUTH_DATA, payload: authData})
        // console.info("got payload data, trying token")
        // if(payload) yield put({type: SET_AUTH_DATA, payload})
        // else yield put({type:  LINKING_FETCHING_CODE})
      } else {
        yield put({type:  LINKING_FETCHING_CODE})
      }
    }
  } catch (e) {
    console.warn(`Error with path change for linking ${e.message}, trying to get linking code`,e)
    yield put({type:  LINKING_FETCHING_CODE})
  }
}

function * authSaga () {
  yield takeLatest(LINKING_FETCHING_CODE, getAuthDeviceCode)
  yield takeLatest(LINKING_POLL_FOR_CODE, getTokenFromPolling)
  yield takeLatest(SET_AUTH_DATA, refreshTokenGen)
  yield takeLatest('@@router/LOCATION_CHANGE', registerPathChange)
}

export default authSaga