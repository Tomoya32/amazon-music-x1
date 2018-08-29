import { all, fork } from 'redux-saga/effects'

import linkingSaga from './linking'

export default function* root() {
  yield all([fork(linkingSaga)])
}