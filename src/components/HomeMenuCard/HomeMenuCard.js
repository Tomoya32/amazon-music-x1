import React from 'react'
import './HomeMenuCard.css'
import cx from 'classnames'

const HomeMenuCard = ({item: {itemLabel, image}, focused}) => (
  <div className={cx({focused}, 'HomeMenuCard')}>
    {image ? <img src={image.uri} height={75} width={75} alt={itemLabel} /> : null}
    <h2>{itemLabel}</h2>
  </div>
)

export default HomeMenuCard