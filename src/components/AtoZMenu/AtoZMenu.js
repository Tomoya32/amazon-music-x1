import React from 'react'
import css from './AtoZMenu.scss'
import cx from 'classnames'
import includes from 'lodash/includes'

const AtoZMenu = ({menuItems, clicked, isFocused, menu: { index }, className, style}) => (
  <div className={cx(css.AtoZMenu, {[className]: className})} style={style}>
    <ul>
      {menuItems.map((letter, idx) => (
        <li
          key={`atoz:${letter}:idx`}
          className={cx({focused: isFocused(idx), clicked: includes(clicked, letter), 'space': letter === '␣', del: letter === 'del'})}
        ><label>{letter}</label></li>
      ))}
    </ul>
  </div>
)
export default AtoZMenu
