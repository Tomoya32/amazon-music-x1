import React from 'react'
import VerticalTextMenu from '../../components/VerticalTextMenu'
import HomeMenu from '../../components/HomeMenu'
import MainMenu from '../../components/MainMenu'
import ListMenu from '../../lib/reactv-redux/SlotMenuRedux'
import Space from '../../lib/reactv-redux/SpaceRedux'
import topnav from '../../components/MainMenu/topnav'
import './Home.css'

const renderMenu = (pathKey) => (
  ({item, focused}) => (<HomeMenu itemDescription={item} pathKey={pathKey} menuid={`homemenu:${item.itemLabel}`} focused={focused} />)
)

const Home = ({catalog: {itemsData}, pathKey, topNav, isFocused, changeFocus, onSubmit, updateMenu}) => {
  return (
    <div>
      <MainMenu className='main-menu' menuid='topnav' mid='topnav' focused={isFocused('topnav')} onEnter={onSubmit}
        onDown={changeFocus('home:main')} onRight={() => updateMenu('topnav', {index: 0})} onLeft={() => updateMenu('topnav', {index: topnav.length - 1 })}/>
      <div className="Home-scrollable">
        {itemsData && itemsData.length &&
        <ListMenu data={itemsData} renderItem={renderMenu(pathKey)} menuid={'home:main'}
          focused={isFocused('home:main')} onUp={changeFocus('topnav')} />}
      </div>
    </div>
  )
}

export default Space(Home)
