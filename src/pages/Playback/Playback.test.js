import React from 'react';
import ReactDOM from 'react-dom';
import Playback from './Playback';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Playback />, div);
  ReactDOM.unmountComponentAtNode(div);
});
