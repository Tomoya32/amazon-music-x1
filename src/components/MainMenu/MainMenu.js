import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import cx from 'classnames'
import includes from 'lodash/includes'
import VerticalTextMenu from '../VerticalTextMenu'

const MainMenu = ({menuItems, isFocused, fading, menu: { index }, focused, pathname}) => {
  return (
    <ul className={cx('VerticalTextMenu', `${fading ? 'faded' : ''}`)}>
      {menuItems.map((link, idx) => {
        let inFocus = isFocused(idx) || (!focused && link.path == pathname)
        return (
          <li key={idx} className={cx({focused: inFocus}, "VerticalTextMenuCard")}>{link.name}</li>
        )
    })}
    </ul>
)}

export default MainMenu
