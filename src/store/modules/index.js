import { combineReducers } from 'redux'
import linking from './linking'
import auth from './auth'
import music from './music'
import tracks from './tracks'
import search from './search'
import home from './home'
import {default as nav} from './nav'
import {KeyEvents, KeyMaps, ListMenuRedux, ReactTVReduxReducer, SpaceRedux, MenusRedux} from '../../lib/reactv-redux'

export default combineReducers({
  linking,
  auth,
  music,
  menus: ReactTVReduxReducer,
  home,
  tracks,
  search,
  navigation: MenusRedux,
  nav
})
