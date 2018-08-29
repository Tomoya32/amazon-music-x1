import React from 'react'
import Home from '../Home'
import Linking from '../Linking'
import {Route} from 'react-router-dom'
const Routes = () => (
  <main>
    <Route exact path="/" component={Home} />
    <Route exact path="/linking" component={Linking} />
  </main>
)

export default Routes