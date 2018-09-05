import { all, fork } from 'redux-saga/effects'

import linkingSaga from './linking'
import musicSaga from './music'
import trackSaga from './tracks'

export default function* root() {
  yield all([fork(linkingSaga), fork(musicSaga), fork(trackSaga)])
}