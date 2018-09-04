import React from 'react'
import './VerticalTextMenuCard.css'
import cx from 'classnames'

const VerticalTextMenuCard = ({item: {name}, focused}) => (
  <div className={cx({focused}, 'VerticalTextMenuCard')}>
    <span>{name}</span>
  </div>
)

export default VerticalTextMenuCard