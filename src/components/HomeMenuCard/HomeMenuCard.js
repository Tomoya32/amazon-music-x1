import React from 'react'
import './HomeMenuCard.css'
import cx from 'classnames'

const HomeMenuCard = ({item: {itemLabel, image, subtitle}, focused}) => (
  <div className={cx({focused}, 'HomeMenuCard')}>
    {image ? <img src={image.uri} height={75} width={75} alt={itemLabel} /> : null}
    {subtitle ? (
      <div className="itemLabel itemLabel--subtitle">
        <label className="title">{itemLabel}</label>
        <label className="subtitle">{subtitle}</label>
      </div>
    ) : (
      <div className="itemLabel">
        <h2 className="title">{itemLabel}</h2>
      </div>
    )}
  </div>
)

export default HomeMenuCard
