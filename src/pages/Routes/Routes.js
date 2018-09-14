import React from 'react'
import NavigationNode from '../Home'
import Linking from '../Linking'
import { Route, Redirect } from 'react-router-dom'
import { authWrapper, userIsNotAuthenticated } from '../../services/auth'
import Node from '../Node'
import Catalog from '../Catalog'
import Playback from '../Playback'
import Search from '../Search'

const Routes = () => (
  <main>
    <Route exact path="/" render={() => (<Redirect to="/music" />)} />
    <Route exact path="/music" component={authWrapper(NavigationNode)} />
    <Route exact path="/music/:parent_id/:current_id" component={authWrapper(Node)} />
    <Route path="/list/:node*" component={authWrapper(Catalog)} />
    <Route path="/playback/:track*" component={authWrapper(Playback)} />
    <Route exact path="/search" component={authWrapper(Search)} />
    <Route exact path="/linking" component={userIsNotAuthenticated(Linking)} />
  </main>
)

export default Routes
