import React from 'react'
import './PlaylistMenu.css'
import ListMenu from '../../lib/reactv-redux/ListMenuRedux'
import PlaylistMenuItem from '../PlaylistMenuItem'
import PropTypes from 'prop-types'

const PlaylistMenu = ({menuid, data, focused, onClick}) => (
  <ListMenu menuid={menuid} className='PlaylistMenu' data={data} renderItem={PlaylistMenuItem} focused={focused} onClick={onClick} />
)

PlaylistMenu.propTypes = {
  menuid: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
}

export default PlaylistMenu