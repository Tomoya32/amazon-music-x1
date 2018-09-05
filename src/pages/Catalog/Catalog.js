import React from 'react'
import './Catalog.css'
import PlaylistMenu from '../../components/PlaylistMenu'

const Catalog = ({kid, onSelect, image, items, summary: {title}}) => (
  <div className='Catalog Page'>
    <div className={'CatalogInfo'}>
      {title && <h1>{title}</h1>}
      {image && (<img src={image.uri} />)}
    </div>
    <div className={'CatalogMenu'}>
      <PlaylistMenu menuid={`catalogmenu:${kid}`} data={items} focused onClick={onSelect}/>
    </div>
  </div>
)

export default Catalog