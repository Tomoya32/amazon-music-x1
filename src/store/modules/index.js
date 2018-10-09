import { combineReducers } from 'redux'
import linking from './linking'
import auth from './auth'
import music from './music'
import tracks from './tracks'
import search from './search'
import home from './home'
import playable from './playable'
import player from './player'
import errorModal from './errormodal'
import {default as nav} from './nav'
import { ReactTVReduxReducer, MenusRedux} from '../../lib/reactv-redux'
import modal from './modal'

export default combineReducers({
  linking,
  auth,
  errorModal,
  music,
  menus: ReactTVReduxReducer,
  home,
  tracks,
  nav,
  player,
  playable,
  search,
  navigation: MenusRedux,
  modal
})
