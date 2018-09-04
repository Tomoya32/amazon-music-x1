import React from 'react'
import VerticalTextMenu from '../../components/VerticalTextMenu'
import HomeMenu from '../../components/HomeMenu'
import ListMenu from '../../lib/reactv-redux/ListMenuRedux'


const renderMenu = ({item, focused}) => (
  <HomeMenu itemDescription={item} menuid={`homevert:${item.itemLabel}`} focused={focused}/>
)

const Home = ({itemDescriptions, topNav}) => {
  if (itemDescriptions && itemDescriptions.length) {
    return (
      <div>
        <VerticalTextMenu items={topNav} menuid={`home:topnav`} />
        <div>
          <ListMenu data={itemDescriptions} renderItem={renderMenu} menuid={'homevert'} focused />
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default Home