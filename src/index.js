import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/App';
import registerServiceWorker from './registerServiceWorker';
// localStorage.debug = "app:*"

import KeyEvents from './lib/reactv-navigation/KeyEvents'
const ke = new KeyEvents()
const mapper = ke.subscribeTo('Back', () => console.warn('Eating back'))
document.addEventListener('keydown', e => console.warn('KeyCode: ' + e.keyCode))

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
