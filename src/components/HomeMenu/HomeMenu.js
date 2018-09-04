import React from 'react'
import HomeHorizontalLoadingMenu from '../HomeMenuHorizontalLoadingMenu'
const HomeMenu = ({itemDescription: {itemLabel, summary: {description}}, focused}) => (
  <div>
    <h1>{itemLabel}</h1>
    <HomeHorizontalLoadingMenu description={description} focused={focused}/>
  </div>
)

export default HomeMenu