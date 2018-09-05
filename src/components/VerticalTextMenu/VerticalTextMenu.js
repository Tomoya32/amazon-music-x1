import React from 'react'
import ListMenu from '../../lib/reactv-redux/ListMenuRedux'
import VerticalTextMenuCard from '../VerticalTextMenuCard'

const VerticalTextMenu = ({items, menuid, ...rest}) => (
  <ListMenu focused renderItem={VerticalTextMenuCard} horizontal menuid={menuid} data={items} className='VerticalTextMenu' {...rest} />
)

export default VerticalTextMenu