import React from 'react'
import VerticalTextMenu from '../../components/VerticalTextMenu'
import HomeMenu from '../../components/HomeMenu'
import MainMenu from '../../components/MainMenu'
import ListMenu, { calculateOffsetHeight } from '../../lib/reactv-redux/SlotMenuRedux'
import Space from '../../lib/reactv-redux/SpaceRedux'
import topnav from '../../components/MainMenu/topnav'
import './Home.css'

const renderMenu = (pathKey) => (
  ({item, focused}) => (<HomeMenu itemDescription={item} pathKey={pathKey} menuid={`homemenu:${item.itemLabel}`} focused={focused} />)
)

const calculateStyle = (currentState, newState, ref) => {
  let offset;
  if (newState.index > currentState.index && newState.slotIndex === currentState.slotIndex) {
    offset = calculateOffsetHeight(ref, newState.index, newState.slotIndex);
    return {transform: `translateY(-${offset}px)`}
  } else if (newState.index < currentState.index && currentState.slotIndex === 0) {
    offset = calculateOffsetHeight(ref, newState.index, newState.slotIndex);
    return {transform: `translateY(-${offset}px)`}
  } else {
    console.info('nothing moved, returning null')
    return null
  }
}

const Home = ({catalog: {itemsData}, pathKey, topNav, isFocused, changeFocus, onSubmit, updateMenu}) => {
  return (
    <div>
      <MainMenu className='main-menu' menuid='topnav' mid='topnav' focused={isFocused('topnav')} onEnter={onSubmit}
        onDown={changeFocus('home:main')} onRight={() => updateMenu('topnav', {index: 0})} onLeft={() => updateMenu('topnav', {index: topnav.length - 1 })}/>
      <div className="Home-scrollable">
        {itemsData && itemsData.length &&
        <ListMenu data={itemsData} renderItem={renderMenu(pathKey)} menuid={'home:main'}
          focused={isFocused('home:main')} onUp={changeFocus('topnav')}
          slots={2}
          calculateStyle={calculateStyle}/>}
      </div>
    </div>
  )
}

export default Space(Home)
