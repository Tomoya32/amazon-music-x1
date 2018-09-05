import React from 'react'
import cx from 'classnames'
const PlaylistMenuItem = ({item: {itemLabel, image}, focused}) => (
  <div className={cx({focused})}>
    {image && <img src={image.uri} height={50} width={50} /> }
    <h2>{itemLabel}</h2>
  </div>
)

export default PlaylistMenuItem