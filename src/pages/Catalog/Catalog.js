import React from 'react'
import './Catalog.css'
import PlaylistMenu from '../../components/PlaylistMenu'

const Catalog = ({kid, onSelect, image, itemsData, summary: {title}}) => (
  <div className='Catalog Page'>
    <div className={'CatalogInfo'}>
      {title && <h1>{title}</h1>}
      {image && (<img src={image.uri} alt={title || ''} />)}
    </div>
    <div className={'CatalogMenu'}>
      <PlaylistMenu menuid={`catalogmenu:${kid}`} data={itemsData} focused onClick={onSelect}/>
    </div>
  </div>
)

export default Catalog