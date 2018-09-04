import { combineReducers } from 'redux'
import linking from './linking'
import auth from './auth'
import music from './music'
import menus from '../../lib/reactv-redux/ReacTVReduxReducer'
import historyReducer from './history'
import home from './home'

export default combineReducers({
  linking,
  auth,
  music,
  menus,
  home,
 // history: historyReducer
})