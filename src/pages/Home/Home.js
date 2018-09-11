import React from 'react'
import VerticalTextMenu from '../../components/VerticalTextMenu'
import HomeMenu from '../../components/HomeMenu'
import ListMenu from '../../lib/reactv-redux/ListMenuRedux'
import Space from '../../lib/reactv-redux/SpaceRedux'

const renderMenu = (pathKey) => (
  ({item, focused}) => (<HomeMenu itemDescription={item} pathKey={pathKey} menuid={`homevert:${item.itemLabel}`} focused={focused} />)
)

const Home = ({catalog: {itemsData}, pathKey, topNav, isFocused, changeFocus}) => {
  return (
    <div>
      <VerticalTextMenu items={topNav} menuid={`home:topnav`} focused={isFocused('topnav')}
        onDown={changeFocus('home:main')} />
      <div>
        {itemsData && itemsData.length &&
        <ListMenu data={itemsData} renderItem={renderMenu(pathKey)} menuid={'homevert'}
          focused={isFocused('home:main')} onUp={changeFocus('topnav')} />}
      </div>
    </div>
  )
}

export default Space(Home)