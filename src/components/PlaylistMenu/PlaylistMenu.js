import React from 'react'
import './PlaylistMenu.css'
import ListMenu from '../../lib/reactv-redux/ListMenuRedux'
import PlaylistMenuItem from '../PlaylistMenuItem'

const PlaylistMenu = ({mid, items}) => (
  <ListMenu menuid={menuid} className='PlaylistMenu' data={items} renderItem={PlaylistMenuItem} />
)

export default NodeTitle