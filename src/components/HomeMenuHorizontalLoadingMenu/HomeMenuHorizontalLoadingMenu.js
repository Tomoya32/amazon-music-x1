import React from 'react'
import ListMenu from '../../lib/reactv-redux/ListMenuRedux'
import HomeMenuCard from '../HomeMenuCard'

const HomeMenuHorizontalLoadingMenu = ({items, name, focused, onClick}) => (
  <ListMenu data={items} menuid={`homemenu:${name}`} renderItem={HomeMenuCard} className='HomeMenuHorizontalLoadingMenu' horizontal focused={focused} onClick={onClick}/>
)

export default HomeMenuHorizontalLoadingMenu