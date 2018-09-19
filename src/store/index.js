import { createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import createHistory from 'history/createBrowserHistory'
import rootReducer from './modules'
import rootSaga from './sagas'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk';
import { enableBatching, batchDispatchMiddleware } from 'redux-batched-actions';


export const history = createHistory()

const initialState = {}
const enhancers = []
const sagaMiddleware = createSagaMiddleware()
const middleware = [
  routerMiddleware(history), sagaMiddleware, thunk, batchDispatchMiddleware
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  connectRouter(history)(enableBatching(rootReducer)),
  initialState,
  composedEnhancers
)
sagaMiddleware.run(rootSaga)

export default store
