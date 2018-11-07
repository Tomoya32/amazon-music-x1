import React, { Component } from 'react'
import HomeMenu from '../../components/HomeMenu'
import cx from 'classnames'
import MainMenu, { MenuComposer } from '../../components/MainMenu'
import { noha } from '../../lib/utils'
import ListMenu, { calculateOffsetHeight } from '../../lib/reactv-redux/SlotMenuRedux'
import Space from '../../lib/reactv-redux/SpaceRedux'
import './Home.css'
import Modal from '../../components/Modal'
import PageLoading from '../../components/PageLoading';

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

const Home = ({catalog: {itemsData}, pathKey, isFocused, changeFocus, onSubmit, updateMenu, fading, showModal, closeModal, navigationNodeSummaries}) => {
  if (showModal && !isFocused('modal')) { changeFocus('modal')() }
  const data = itemsData.filter(item => {
    const _summary = noha(item.navigationNodeSummary)
    const navNodeSum = navigationNodeSummaries[_summary];
    return (navNodeSum && navNodeSum.numItemsOfInterest !== 0)
  })
  return (
    <div>
      {showModal && <Modal className='amazon-unlimited-modal' menuid='modal' onFocusItem='action' focused={isFocused('modal')}
        onEnter={() => {
          closeModal()
          changeFocus('home:main')()
        }} />}
      <div className={cx('Home-scrollable', `${fading ? 'faded' : ''}`)}>
        {data && data.length &&
        <ListMenu data={data} renderItem={renderMenu(pathKey)} menuid={'home:main'}
          focused={isFocused('home:main')} onUp={changeFocus('topnav')}
          slots={2}
          calculateStyle={calculateStyle}/>}
      </div>
    </div>
  )
}

export default Space(MenuComposer(MainMenu,Home))
