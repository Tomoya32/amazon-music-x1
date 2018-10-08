import { call, takeLatest, put } from 'redux-saga/effects'
import {delay} from 'redux-saga'

import config from '../../config'
import {DISPLAY_ERROR, HIDE_ERROR} from '../modules/errormodal'

const getData = state => state.music.nodes

// Dealing with some circular dependencies here.

function * hideErrorModal () {
  yield call(delay, config.errorModalTimeout)
  yield put({type: HIDE_ERROR})
}

function * errorSaga () {
  yield takeLatest(DISPLAY_ERROR, hideErrorModal)
}

export default errorSaga