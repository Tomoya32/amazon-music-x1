import css from './AtoZMenu.css'
import React from 'react'
import cx from 'classnames'
import includes from 'lodash/includes'
import './AtoZMenu.css'

const AtoZMenu = ({menuItems, clicked, isFocused, menu: { index }, className, style}) => (
  <div className={cx(css.AtoZMenu, className)} style={style}>
    <ul>
      {menuItems.map((letter, idx) => (
        <li key={`atoz:${letter}:idx`} className={cx({focused: isFocused(idx), clicked: includes(clicked, letter)})}>{letter}</li>
      ))}
    </ul>
  </div>
)
export default AtoZMenu
