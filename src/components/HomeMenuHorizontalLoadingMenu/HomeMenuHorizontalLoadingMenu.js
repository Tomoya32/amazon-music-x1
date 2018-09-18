import React from 'react'
import ListMenu from '../../lib/reactv-redux/SlotMenuRedux'
import HomeMenuCard from '../HomeMenuCard'
import {calculateOffset} from '../../lib/reactv-redux/SlotMenuRedux'


const calculateStyle = (currentState, newState, ref) => {
  if (newState.index > currentState.index && newState.slotIndex === currentState.slotIndex) {
    return {transform: `translateX(-${calculateOffset(ref, newState.index, newState.slotIndex)}px)`}
  } else if (newState.index < currentState.index && currentState.slotIndex === 0) {
    return {transform: `translateX(-${calculateOffset(ref, newState.index, newState.slotIndex)}px)`}
  } else {
    console.info('nothing moved, returning null')
    return null
  }
}

const HomeMenuHorizontalLoadingMenu = ({itemsData, name, focused, onClick}) => (
  <ListMenu
    data={itemsData.slice(0,5)}
    menuid={`homemenu:${name}`}
    renderItem={HomeMenuCard}
    className='HomeMenuHorizontalLoadingMenu'
    horizontal
    focused={focused}
    onClick={onClick}
    slots={5}
    calculateStyle={calculateStyle}/>
)

export default HomeMenuHorizontalLoadingMenu