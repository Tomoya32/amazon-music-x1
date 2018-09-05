import { combineReducers } from 'redux'
import linking from './linking'
import auth from './auth'
import music from './music'
import tracks from './tracks'
import menus from '../../lib/reactv-redux/ReacTVReduxReducer'
import home from './home'
import {default as nav} from './nav'

export default combineReducers({
  linking,
  auth,
  music,
  menus,
  home,
  tracks,
  nav
})