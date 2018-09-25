import React from 'react'
import ListMenu, {calculateOffset, SlotLinker} from '../../lib/reactv-redux/SlotMenuRedux'
import HomeMenuCard from '../HomeMenuCard'
import store from '../../store'

const linker = new SlotLinker(store)

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

const HomeMenuHorizontalLoadingMenu = ({itemsData, name, focused, onClick, allMenuIDs}) => {
  const menuid = `homemenu:${name}`;
  const data = itemsData.slice(0,5);
  data.push({itemLabel: 'See More', navigationNodeSummary: name})
  return (
  <ListMenu
    data={data}
    menuid={menuid}
    renderItem={HomeMenuCard}
    className='HomeMenuHorizontalLoadingMenu'
    horizontal
    focused={focused}
    onClick={onClick}
    slots={3}
    calculateStyle={calculateStyle}
    onChange={linker.link(menuid,allMenuIDs)}
    onFocus={linker.link(menuid,allMenuIDs)}/>
)}

export default HomeMenuHorizontalLoadingMenu
