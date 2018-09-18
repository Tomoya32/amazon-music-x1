import React from 'react'
import './PlaylistMenu.css'
import ListMenu from '../../lib/reactv-redux/SlotMenuRedux'
import PlaylistMenuItem from '../PlaylistMenuItem'
import PropTypes from 'prop-types'
import {calculateOffsetHeight} from '../../lib/reactv-redux/SlotMenuRedux'


const calculateStyle = (currentState, newState, ref) => {
  if (newState.index > currentState.index && newState.slotIndex === currentState.slotIndex) {
    return {transform: `translateY(-${calculateOffsetHeight(ref, newState.index, newState.slotIndex)}px)`}
  } else if (newState.index < currentState.index && currentState.slotIndex === 0) {
    return {transform: `translateY(-${calculateOffsetHeight(ref, newState.index, newState.slotIndex)}px)`}
  } else {
    return null
  }
}

const PlaylistMenu = ({menuid, data, focused, onClick}) => (
  <ListMenu menuid={menuid} className='PlaylistMenu' data={data} renderItem={PlaylistMenuItem} focused={focused} onClick={onClick} slots={8} calculateStyle={calculateStyle}/>
)

PlaylistMenu.propTypes = {
  menuid: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
}

export default PlaylistMenu