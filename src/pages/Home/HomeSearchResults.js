import React from 'react'
import HomeMenu from '../../components/HomeMenu/HomeMenuSearchResults'
import MainMenu, { MenuComposer } from '../../components/MainMenu'
import ListMenu, { calculateOffsetHeight } from '../../lib/reactv-redux/SlotMenuRedux'
import Space from '../../lib/reactv-redux/SpaceRedux'
import './Home.css'
import Modal from '../../components/Modal'

const renderMenu = (pathKey, onFarLeft) => (
  ({item, focused}) => (
    <HomeMenu
      itemDescription={item}
      pathKey={pathKey}
      menuid={`homemenu:${item.itemLabel}`}
      focused={focused}
      onFarLeft={onFarLeft}
    />
  )
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

const Home = ({catalog: {itemsData}, pathKey, isFocused, changeFocus, onSubmit, updateMenu, closeModal}) => {
  if (itemsData && itemsData.length) {
    return (
      <div className="Home-scrollable">
        <ListMenu
          data={itemsData}
          renderItem={renderMenu(pathKey, changeFocus('search:atoz'))}
          menuid={'home:main'}
          focused={isFocused('home:main')}
          onUp={changeFocus('topnav')}
          slots={2}
          calculateStyle={calculateStyle}
        />
      </div>
  )
  } else return null
}

export default Space(Home)
