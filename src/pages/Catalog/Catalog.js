import React from 'react'
import './Catalog.css'
import PlaylistMenu from '../../components/PlaylistMenu'

const Catalog = ({kid, onSelect, thumbnail, itemsData, summaryData: {title}, passRef}) => (
  <div className='Catalog Page'>
    <div className={'CatalogInfo'}>
      {title && <h1>{title}</h1>}
      {thumbnail && (<img src={thumbnail.uri} alt={title || ''} />)}
    </div>
    <div className={'CatalogMenu'}>
      <PlaylistMenu menuid={`catalogmenu:${kid}`} data={itemsData} focused onClick={onSelect} passRef={passRef}/>
    </div>
  </div>
)

export default Catalog
