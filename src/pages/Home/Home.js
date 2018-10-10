import React from 'react'
import VerticalTextMenu from '../../components/VerticalTextMenu'
import HomeMenu from '../../components/HomeMenu'
import MainMenu, { MenuComposer } from '../../components/MainMenu'
import ListMenu, { calculateOffsetHeight } from '../../lib/reactv-redux/SlotMenuRedux'
import RCPagination from '../../lib/reactv-navigation/components/Pagination'
import Space from '../../lib/reactv-redux/SpaceRedux'
import './Home.css'
import Modal from '../../components/Modal'

const renderMenu = (pathKey) => (
  ({item, focused}) => (<HomeMenu itemDescription={item} pathKey={pathKey} menuid={`homemenu:${item.itemLabel}`} focused={focused} />)
)

const calculateStyle = (currentState, newState, ref) => {
  let offset;
  if (newState.index > currentState.index && newState.slotIndex === currentState.slotIndex) {
    offset = calculateOffsetHeight(ref, newState.index, newState.slotIndex) + currentState.index*32;
    return {transform: `translateY(-${offset}px)`}
  } else if (newState.index < currentState.index && currentState.slotIndex === 0) {
    offset = calculateOffsetHeight(ref, newState.index, newState.slotIndex) + newState.index*32;
    return {transform: `translateY(-${offset}px)`}
  } else {
    console.info('nothing moved, returning null')
    return null
  }
}

const Home = ({catalog: {itemsData}, pathKey, isFocused, changeFocus, updateMenu}) => {
  return (
      <div className="Home-scrollable">
        {itemsData && itemsData.length &&
        <ListMenu data={itemsData} renderItem={renderMenu(pathKey)} menuid={'home:main'}
          focused={isFocused('home:main')} onUp={changeFocus('topnav')}
          slots={2}
          calculateStyle={calculateStyle}/>}
      </div>
  )
}

export default Space(MenuComposer(MainMenu,Home))
