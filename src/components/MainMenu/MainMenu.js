import React from 'react'
import { NavLink } from 'react-router-dom'
import cx from 'classnames'
import includes from 'lodash/includes'
import VerticalTextMenu from '../VerticalTextMenu'

const MainMenu = ({menuItems, clicked, isFocused, menu: { index }, className, focused, pathname, style}) => {
  return (
  <div className={className} style={style}>
    <ul className="VerticalTextMenu">
      {menuItems.map((link, idx) => {
        let inFocus = isFocused(idx) || (!focused && link.path == pathname)
        return (
          <li key={idx} className={cx({focused: inFocus, clicked: includes(clicked, link.name)}, "VerticalTextMenuCard")}>{link.name}</li>
        )
    })}
    </ul>
  </div>
)}

// const MainMenu = ({menuItems, clicked, isFocused, menu: { index }, className, style, focused}) => {
//   const focusOn = isFocused('topnav')
//   // debugger;
//   return (
//   <VerticalTextMenu items={menuItems} menuid='topnav' focused={focused}/>
// )}

export default MainMenu
