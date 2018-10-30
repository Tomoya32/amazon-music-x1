import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import {delay} from 'redux-saga'
import API from '../../services/service'
import { GIVE_THUMBS, DISPLAY_THUMBS_MESSAGE, HIDE_THUMBS_MESSAGE } from '../modules/thumbs'
import config from '../../config'

function * giveThumbs (action) {
  try {
    const { trackRatingRequest: { URI, body } } = action;
    yield put({type: HIDE_THUMBS_MESSAGE})
    const payload = yield call(API.sendThumbs, URI, body)
    const { rating_response } = payload.data.trackRatingResponses;
    yield put({type: DISPLAY_THUMBS_MESSAGE, payload: rating_response})
  } catch (e) {
    console.warn(`Error sending thumbs feedback for route ${action.trackRatingRequest.body.ratingURI} ${e.message}`, e)
  }
}

function * hideThumbsModal (payload) {
  yield call(delay, config.errorModalTimeout)
  yield put({type: HIDE_THUMBS_MESSAGE})
}

function * thumbsSaga () {
  yield takeEvery(GIVE_THUMBS, giveThumbs)
  yield takeLatest(DISPLAY_THUMBS_MESSAGE, hideThumbsModal)
}

export default thumbsSaga
