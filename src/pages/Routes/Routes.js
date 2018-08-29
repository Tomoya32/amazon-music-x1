import React from 'react'
import Home from '../Home'
import Linking from '../Linking'
import {Route} from 'react-router-dom'
import {authWrapper, userIsNotAuthenticated} from '../../services/auth'

const Routes = () => (
  <main>
    <Route exact path="/" component={authWrapper(Home)} />
    <Route exact path="/linking" component={userIsNotAuthenticated(Linking)} />
  </main>
)

export default Routes