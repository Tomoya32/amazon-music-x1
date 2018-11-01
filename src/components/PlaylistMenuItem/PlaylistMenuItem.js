import React from 'react'
import cx from 'classnames'
import css from './PlaylistMenuItem.scss'
import PlayIcon from '../../assets/images/icon/play-icon.js'

const PlaylistMenuItem = ({item: {itemLabel, image, subtitle}, focused}) => (
  <div className={cx(css.PlaylistMenuItem, {focused})}>
    {
      focused ? <div style={{'margin-right': '25px'}}><PlayIcon fill={'#fff'} /></div>
        : image && <img src={image.uri} height={60} width={60} alt={itemLabel} className='image' />
    }
    <div className='info'>
      <label className='title'>{itemLabel}</label>
      <label className='subtitle'>{subtitle}</label>
    </div>
  </div>
)

export default PlaylistMenuItem
