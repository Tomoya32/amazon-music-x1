import React from 'react'
import { NavLink } from 'react-router-dom'
import './VerticalTextMenuCard.css'
import cx from 'classnames'
import { push } from '../../store/modules/nav'

const onClick = (name) => {
  push(name)
}

const VerticalTextMenuCard = ({item: {name}, focused}) => (
  <div className={cx({focused}, 'VerticalTextMenuCard')}>
    <NavLink
      to={`/${name.toLowerCase()}`}
      activeClassName="selected"
      onClick={onClick}
    >{name}</NavLink>
  </div>
)

export default VerticalTextMenuCard
