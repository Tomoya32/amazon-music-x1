import React from 'react'
import css from './PlayerControlButton.scss'
import buttonComposer from '../../lib/reactv-navigation/components/Button'
import cx from 'classnames'

const PlayerControlButton = ({focused, style, children, className, disabled}) => (
  <div className={cx(css.PlayerControlButton, {focused, disabled}, className)} style={style}>
    {children}
  </div>
)

export default buttonComposer(PlayerControlButton)
