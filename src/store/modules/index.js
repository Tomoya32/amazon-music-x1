import { combineReducers } from 'redux'
import linking from './linking'
import auth from './auth'

export default combineReducers({
  linking, auth
})