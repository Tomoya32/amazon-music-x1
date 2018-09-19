import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/App';
import registerServiceWorker from './registerServiceWorker';
localStorage.debug = "*"
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
