import React from 'react'
import VerticalTextMenu from '../../components/VerticalTextMenu'
import HomeMenu from '../../components/HomeMenu'
import ListMenu from '../../lib/reactv-redux/ListMenuRedux'
import Space from '../../lib/reactv-redux/SpaceRedux'
import './Home.css'

const renderMenu = ({item, focused}) => (
  <HomeMenu itemDescription={item} menuid={`homevert:${item.itemLabel}`} focused={focused} />
)

const Home = ({itemDescriptions, topNav, isFocused, changeFocus}) => {
  if (itemDescriptions && itemDescriptions.length) {
    return (
      <div className="Home-content">
        <VerticalTextMenu items={topNav} menuid={`home:topnav`} focused={isFocused('topnav')} onDown={changeFocus('home:main')} />
        <div className="Home-scrollable">
          <ListMenu data={itemDescriptions} renderItem={renderMenu} menuid={'homevert'} focused={isFocused('home:main')} onUp={changeFocus('topnav')} />
        </div>
      </div>

    )
  } else {
    return null
  }
}

export default Space(Home)
