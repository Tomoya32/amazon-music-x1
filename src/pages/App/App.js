import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from '../../store'
import Routes from '../Routes'
import Player from '../../components/Player'

import './App.css'

const App = () => (
  <div>
    <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
    </Provider>
  </div>
)

export default App