import React from 'react'
import { connect } from 'react-redux'
import HomeHorizontalLoadingMenu from '../HomeMenuHorizontalLoadingMenu/HomeMenuHorizontalLoadingMenuContainerSearchResults'

const mapStateToProps = (state) => ({
  term: state.search.term,
})

const HomeMenu = ({ focused, itemDescription, pathKey, term, onFarLeft}) => {
  return (
    <div>
      <h1>{itemDescription.itemLabel}</h1>
      <HomeHorizontalLoadingMenu focused={focused} itemDescription={itemDescription} pathKey={pathKey} nodeKey={itemDescription} onFarLeft={onFarLeft} />
    </div>
  )
}

export default connect(mapStateToProps)(HomeMenu)
