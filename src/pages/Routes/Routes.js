import React from 'react'
import Home from '../Home'
import Linking from '../Linking'
import { Route, Redirect } from 'react-router-dom'
import { authWrapper, userIsNotAuthenticated } from '../../services/auth'
import Catalog from '../Catalog'
import Playback from '../Playback'
import config from '../../config'
import uj from 'url-join'
import Search from '../Search'
import Music from '../Music'

const Routes = () => (
  <main>
    <Route exact path="/" render={() => (<Redirect to={uj('/music',config.music.browse_node)} />)} />
    {/*<Route exact path="/music" component={authWrapper(NavigationNode)} />*/}
    <Route path="/music/:section?*" component={authWrapper(Home)} />
    <Route path="/list/:node*" component={authWrapper(Catalog)} />
    <Route path="/playback/:track*" component={authWrapper(Playback)} />
    <Route exact path="/mymusic" component={authWrapper(Music)} />
    <Route exact path="/search" component={authWrapper(Search)} />
    <Route exact path="/linking" component={userIsNotAuthenticated(Linking)} />
  </main>
)

export default Routes
