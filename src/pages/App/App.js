import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from '../../store'
import Routes from '../Routes'
import Player from '../../components/Player'

import './App.css'
import ErrorModal from '../../components/ErrorModal'

const App = () => (
  <div>
    <Provider store={store}>
      <div>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
        <ErrorModal />
        <Player/>
      </div>
    </Provider>
  </div>
)

export default App
