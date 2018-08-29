import React from 'react';
import ReactDOM from 'react-dom';
import Linking from './Linking';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Linking />, div);
  ReactDOM.unmountComponentAtNode(div);
});
