import React from 'react'
import HomeHorizontalLoadingMenu from '../HomeMenuHorizontalLoadingMenu'
const HomeMenu = ({focused, itemDescription, pathKey}) => (
  <div>
    <h1>{itemDescription.itemLabel}</h1>
    <HomeHorizontalLoadingMenu focused={focused} itemDescription={itemDescription} pathKey={pathKey} nodeKey={itemDescription}/>
  </div>
)

export default HomeMenu