import React from 'react'
import cx from 'classnames'
import css from './Catalog.scss'
import PlaylistMenu from '../../components/PlaylistMenu'

const Catalog = ({kid, onSelect, thumbnail, itemsData, summaryData: {title}, passRef}) => (
  <div className={cx(css.Catalog, 'Page')}>
    <div className={'info'}>
      {title && <label className='title'>{title}</label>}
      {thumbnail && (<img src={thumbnail.uri} alt={title || ''} className='image' />)}
    </div>
    <PlaylistMenu menuid={`catalogmenu:${kid}`} data={itemsData} focused onClick={onSelect} passRef={passRef} slots={4} />
  </div>
)

export default Catalog
